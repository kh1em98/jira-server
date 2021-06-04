import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdmin1622815879827 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            insert into public."user"("firstName", "lastName", "password" ,email, "role")
            values ('Khiem', 'Nguyen', '$2b$10$W/mILsdCSzdvX81SL.RDJuM/OcDKpM9iNnv.tAdidryeIZ7i4RSP2','admin@gmail.com', 'admin')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            delete from public."user"
            where email = "admin@gmail.com"
        `);
  }
}
