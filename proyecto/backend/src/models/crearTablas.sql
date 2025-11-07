CREATE TABLE IF NOT EXISTS "archivos-cliente" (
    "ruta-archivo" character varying(300) NOT NULL,
    "tipo-archivo" character varying(100) NOT NULL,
    "fecha-subida" date NOT NULL,
    "rut-cliente" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS bancario (
    rut integer NOT NULL,
    cargo character varying(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS cliente (
    rut integer NOT NULL,
    salario integer DEFAULT 0,
    rubro character varying(100),
    genero character(1),
    email character varying(100),
    telefono character varying(20),
    scoring integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "cuentas-bancarias-usuario" (
    id integer NOT NULL,
    banco character varying(100) NOT NULL,
    tipo_cuenta character varying(50) NOT NULL,
    "rut-cliente" integer NOT NULL
);


CREATE TABLE IF NOT EXISTS "funcion-crediticia" (
    "fecha-modificacion" date NOT NULL,
    funcion character varying NOT NULL,
    "rut-bancario-modificador" integer NOT NULL,
    id SERIAL NOT NULL
);

CREATE TABLE IF NOT EXISTS "pago-cuota" (
    id integer NOT NULL,
    "n-cuota" integer NOT NULL,
    "fecha-pago-ideal" date NOT NULL,
    "fecha-pago" date,
    "monto-original" integer NOT NULL,
    "interes-por-atraso" numeric DEFAULT 1 NOT NULL,
    "estado-pago" character varying(20) NOT NULL,
    "metodo-de-pago" character varying(50) NOT NULL,
    "id-prestamo" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS prestamo (
    id integer NOT NULL,
    fecha date NOT NULL,
    monto integer NOT NULL,
    "numero-cuotas" integer NOT NULL,
    "tasa-interes" numeric NOT NULL,
    "scoring-requerido" integer NOT NULL,
    "scoring-cliente" character varying NOT NULL,
    "estado-aprobacion" character varying NOT NULL,
    "estado-pago" character varying(20) NOT NULL,
    "rut-cliente" integer NOT NULL,
    "id-cuenta-destino" integer NOT NULL,
    "id-funcion-crediticia" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    rut integer NOT NULL,
    pass character varying(80) NOT NULL,
    "primer-nombre" character varying(100) NOT NULL,
    "segundo-nombre" character varying(100),
    "apellido-paterno" character varying(100) NOT NULL,
    "apellido-materno" character varying(100),
    tipo character(1) NOT NULL,
    "fecha-nacimiento" date NOT NULL
);

-- Agregar la tabla simulacion, ya con el seguro listo
CREATE TABLE IF NOT EXISTS "simulacion-prestamo" (
    id SERIAL PRIMARY KEY,
    fecha date NOT NULL,
    monto integer NOT NULL,
    "numero-cuotas" integer NOT NULL,
    "tasa-interes" numeric NOT NULL,
    "scoring-requerido" integer NOT NULL,
    "rut-cliente" integer NOT NULL,
    "id-funcion-crediticia" integer NOT NULL,
    "seguro" character varying(50) NOT NULL
);

ALTER TABLE "archivos-cliente" DROP CONSTRAINT IF EXISTS archivos_cliente_unique CASCADE;
ALTER TABLE ONLY "archivos-cliente"
    ADD CONSTRAINT archivos_cliente_unique UNIQUE ("rut-cliente", "ruta-archivo");

ALTER TABLE "cuentas-bancarias-usuario" DROP CONSTRAINT IF EXISTS cuentas_bancarias_usuario_pk CASCADE;
ALTER TABLE ONLY "cuentas-bancarias-usuario"
    ADD CONSTRAINT cuentas_bancarias_usuario_pk PRIMARY KEY (id);

ALTER TABLE "funcion-crediticia" DROP CONSTRAINT IF EXISTS funcion_crediticia_pk CASCADE;
ALTER TABLE ONLY "funcion-crediticia"
    ADD CONSTRAINT funcion_crediticia_pk PRIMARY KEY (id);

ALTER TABLE bancario DROP CONSTRAINT IF EXISTS newtable_pk CASCADE;
ALTER TABLE ONLY bancario
    ADD CONSTRAINT newtable_pk PRIMARY KEY (rut);

ALTER TABLE "pago-cuota" DROP CONSTRAINT IF EXISTS pago_cuota_pk CASCADE;
ALTER TABLE ONLY "pago-cuota"
    ADD CONSTRAINT pago_cuota_pk PRIMARY KEY (id);

ALTER TABLE prestamo DROP CONSTRAINT IF EXISTS prestamo_pk CASCADE;
ALTER TABLE ONLY prestamo
    ADD CONSTRAINT prestamo_pk PRIMARY KEY (id);

ALTER TABLE cliente DROP CONSTRAINT IF EXISTS rut CASCADE;
ALTER TABLE ONLY cliente
    ADD CONSTRAINT rut PRIMARY KEY (rut);

ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "rut-user" CASCADE;
ALTER TABLE ONLY "user"
    ADD CONSTRAINT "rut-user" PRIMARY KEY (rut);

ALTER TABLE "archivos-cliente" DROP CONSTRAINT IF EXISTS archivos_cliente_cliente_fk CASCADE;
ALTER TABLE ONLY "archivos-cliente"
    ADD CONSTRAINT archivos_cliente_cliente_fk FOREIGN KEY ("rut-cliente") REFERENCES cliente(rut);

ALTER TABLE bancario DROP CONSTRAINT IF EXISTS bancario_user_fk CASCADE;
ALTER TABLE ONLY bancario
    ADD CONSTRAINT bancario_user_fk FOREIGN KEY (rut) REFERENCES "user"(rut);

ALTER TABLE cliente DROP CONSTRAINT IF EXISTS cliente_user_fk CASCADE;
ALTER TABLE ONLY cliente
    ADD CONSTRAINT cliente_user_fk FOREIGN KEY (rut) REFERENCES "user"(rut);

ALTER TABLE "cuentas-bancarias-usuario" DROP CONSTRAINT IF EXISTS cuentas_bancarias_usuario_cliente_fk CASCADE;
ALTER TABLE ONLY "cuentas-bancarias-usuario"
    ADD CONSTRAINT cuentas_bancarias_usuario_cliente_fk FOREIGN KEY ("rut-cliente") REFERENCES cliente(rut);

ALTER TABLE "funcion-crediticia" DROP CONSTRAINT IF EXISTS funcion_crediticia_bancario_fk CASCADE;
ALTER TABLE ONLY "funcion-crediticia"
    ADD CONSTRAINT funcion_crediticia_bancario_fk FOREIGN KEY ("rut-bancario-modificador") REFERENCES bancario(rut);

ALTER TABLE "pago-cuota" DROP CONSTRAINT IF EXISTS pago_cuota_prestamo_fk CASCADE;
ALTER TABLE ONLY "pago-cuota"
    ADD CONSTRAINT pago_cuota_prestamo_fk FOREIGN KEY ("id-prestamo") REFERENCES prestamo(id) ON DELETE CASCADE;

ALTER TABLE prestamo DROP CONSTRAINT IF EXISTS prestamo_cliente_fk CASCADE;
ALTER TABLE ONLY prestamo
    ADD CONSTRAINT prestamo_cliente_fk FOREIGN KEY ("rut-cliente") REFERENCES cliente(rut);

ALTER TABLE prestamo DROP CONSTRAINT IF EXISTS prestamo_cuentas_bancarias_usuario_fk CASCADE;
ALTER TABLE ONLY prestamo
    ADD CONSTRAINT prestamo_cuentas_bancarias_usuario_fk FOREIGN KEY ("id-cuenta-destino") REFERENCES "cuentas-bancarias-usuario"(id);

ALTER TABLE prestamo DROP CONSTRAINT IF EXISTS prestamo_funcion_crediticia_fk CASCADE;
ALTER TABLE ONLY prestamo
    ADD CONSTRAINT prestamo_funcion_crediticia_fk FOREIGN KEY ("id-funcion-crediticia") REFERENCES "funcion-crediticia"(id);


--Constraints para la tabla de simulaciones. Comentado porque ahora se agrega automarica la pk
-- ALTER TABLE "simulacion-prestamo" DROP CONSTRAINT IF EXISTS simulacion_prestamo_pk CASCADE;
-- ALTER TABLE ONLY "simulacion-prestamo"
--     ADD CONSTRAINT simulacion_prestamo_pk PRIMARY KEY (id);

ALTER TABLE "simulacion-prestamo" DROP CONSTRAINT IF EXISTS simulacion_prestamo_cliente_fk CASCADE;
ALTER TABLE ONLY "simulacion-prestamo"
    ADD CONSTRAINT simulacion_prestamo_cliente_fk FOREIGN KEY ("rut-cliente") REFERENCES cliente(rut);

ALTER TABLE "simulacion-prestamo" DROP CONSTRAINT IF EXISTS simulacion_prestamo_funcion_crediticia_fk CASCADE;
ALTER TABLE ONLY "simulacion-prestamo"
    ADD CONSTRAINT simulacion_prestamo_funcion_crediticia_fk FOREIGN KEY ("id-funcion-crediticia") REFERENCES "funcion-crediticia"(id);

-- Añadir el atributo seguro a la tabla de prestamos. Ojo sólo si no existe ya pa evitar errores
ALTER TABLE prestamo
ADD COLUMN IF NOT EXISTS "seguro" character varying(50) NOT NULL DEFAULT 'Sin seguro';



-- Esto se borrará después, pero es mientras no tengamos el webeo del scoring implementado

ALTER TABLE "simulacion-prestamo"
ALTER COLUMN "id-funcion-crediticia" DROP NOT NULL,
ALTER COLUMN "scoring-requerido" DROP NOT NULL;

