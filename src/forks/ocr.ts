import * as Jimp from 'jimp';
import * as path from 'path';
import * as Tesseract from 'tesseract.js';
import { Progress } from 'tesseract.js';

process.on('message', (msg) => {
    Jimp.read(msg).then(value => {
        const contrastLVL = 0.6;
        const thresh = 30;
        console.log('downloaded image');
        value.scaleToFit(value.bitmap.width * 2, value.bitmap.height * 2).contrast(contrastLVL).scan(0, 0, value.bitmap.width, value.bitmap.height, function (x, y, idx) {
            const red   = this.bitmap.data[idx ];
            const green = this.bitmap.data[idx + 1];
            const blue  = this.bitmap.data[idx + 2];
            const gray =  (0.299 * red + 0.587 * green + 0.114 * blue);
            if ( gray > thresh ) {
                // Set the pixel is white.
                this.bitmap.data[idx] = 255;
                this.bitmap.data[idx + 1] = 255;
                this.bitmap.data[idx + 2] = 255;
                this.bitmap.data[idx + 3] = 255;
            } else {
                // Set the pixel is black.
                this.bitmap.data[idx] = 0;
                this.bitmap.data[idx + 1] = 0;
                this.bitmap.data[idx + 2] = 0;
                this.bitmap.data[idx + 3] = 255;
            }
        }).getBuffer(value.getMIME(), (err: Error, buffer: Buffer) => {
            Tesseract.recognize(buffer, {
                lang: path.join(__dirname, '../../langs/eng'),
                tessedit_pageseg_mode: 4
            })
                .progress(function  (p: Progress) { console.log('progress', p);  })
                .catch((err: Error) => console.error(err))
                .finally((resultOrError) => {
                    if ('text' in resultOrError) {
                        // console.log(resultOrError.text);
                        process.send(resultOrError.text);
                    }
                });
        });
    });
});