import { MigrationInterface, QueryRunner } from 'typeorm';

export class Role1622779442578 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE public."user"
            ADD role varchar(6) NOT NULL
            DEFAULT "user"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE public."user"
            DROP COLUMN role
        `);
  }
}
