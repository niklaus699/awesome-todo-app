import db from "../db.js";

const initDB = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      username text NOT NULL,
      email text NOT NULL,
      password_hash text NOT NULL,
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT users_pkey PRIMARY KEY (id),
      CONSTRAINT users_email_key UNIQUE (email),
      CONSTRAINT users_username_key UNIQUE (username)
    );

    CREATE SEQUENCE IF NOT EXISTS todos_id_seq;

    CREATE TABLE IF NOT EXISTS public.todos (
      id integer NOT NULL DEFAULT nextval('todos_id_seq'::regclass),
      user_id uuid NOT NULL,
      text text NOT NULL,
      completed boolean DEFAULT false,
      position integer NOT NULL,
      created_at timestamp without time zone DEFAULT now(),
      CONSTRAINT todos_pkey PRIMARY KEY (id),
      CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_todos_user_id
      ON public.todos USING btree (user_id ASC NULLS LAST);

    CREATE INDEX IF NOT EXISTS idx_todos_user_position
      ON public.todos USING btree (user_id ASC NULLS LAST, position ASC NULLS LAST);
  `);
  console.log("Database initialized successfully");
};

export default initDB;
