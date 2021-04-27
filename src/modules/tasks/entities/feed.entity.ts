import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Feed {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    channelId!: string

    @Column()
    type!: string

    @Column()
    url!: string
}
