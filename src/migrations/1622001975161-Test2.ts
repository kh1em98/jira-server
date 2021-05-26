import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test21622001975161 implements MigrationInterface {
  name = 'Test21622001975161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "fullName" TO "fullname"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "fullname" TO "fullName"`,
    );
  }
}
