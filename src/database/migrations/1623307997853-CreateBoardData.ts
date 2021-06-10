import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardData1623307997853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Hello');
    queryRunner.query(`
            INSERT INTO public."board" (
                id, title, "creatorId"
            )
            VALUES (1, 'Social Application', 11)
    `);

    queryRunner.query(`
            INSERT INTO public."board" (
                id, title, "creatorId"
            )
            VALUES (2, 'Backend, DevOps', 11)
    `);

    queryRunner.query(`
            INSERT INTO public."board" (
                id, title, "creatorId"
            )
            VALUES (3, 'Blockchain', 11)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table public."board"
    `);
  }
}
