import { Column, Entity, Index } from "typeorm";

@Index("uq_data_discord_id", ["discordId"], { unique: true })
@Index("uq_data_uuid", ["uuid"], { unique: true })
@Entity("data", { schema: "guild_cache" })
export class Data {
  @Column("int", { primary: true, name: "data_id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "uuid", unique: true, length: 255 })
  uuid: string;

  @Column("varchar", { name: "discord_id", unique: true, length: 255 })
  discordId: string;

  @Column("varchar", { name: "tag", length: 255 })
  tag: string;

  @Column("varchar", { name: "nickname", length: 255 })
  nickname: string;

  @Column("varchar", { name: "avatar", length: 255 })
  avatar: string;

  @Column("varchar", { name: "guild_id", length: 255 })
  guildId: string;

  @Column("datetime", { name: "created_at" })
  createdAt: Date;

  @Column("datetime", { name: "cached_at", default: () => "CURRENT_TIMESTAMP" })
  cachedAt: Date;
}
