import {
  BeforeUpdate,
  Entity,
  MikroORM,
  PrimaryKey,
  Property,
} from "@mikro-orm/sqlite";

@Entity()
class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  private _email!: string;
  private _noProperty!: string;
  @Property({ unique: true, getter: true, setter: true })
  get email() {
    return this._email;
  }

  set email(value) {
    this._email = "throughsetter";
  }

  get noProperty() {
    return this._noProperty;
  }

  set noProperty(value) {
    this._noProperty = "throughsetter";
  }

  constructor(name: string) {
    this.name = name;
  }
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ":memory:",
    entities: [User],
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  await orm.close(true);
});

test("@Property decorator through setter", async () => {
  const userEntity = new User("name");
  userEntity.email = "email";
  expect(userEntity.email).toBe("throughsetter");
});

test("no decorator through setter", async () => {
  const userEntity = new User("name");
  userEntity.noProperty = "email";
  expect(userEntity.noProperty).toBe("throughsetter");
});
