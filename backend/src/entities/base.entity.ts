import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseEntity<T> {
  /**
   * The unique id of this entity.
   */
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ type: () => String })
  public internalId: T;

  /**
   * When this entity was created in the database.
   */
  @CreateDateColumn()
  public createdAt: Date;

  /**
   * When this entity was last updated in the database.
   */
  @UpdateDateColumn()
  public updatedAt: Date;

  /**
   * The version of this entity. This will be incremented each time the entity gets updated.
   */
  @VersionColumn()
  public version: number;
}
