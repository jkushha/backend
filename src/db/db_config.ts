import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: process.env.DATABASE_DIALECT as any,
    logging: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    replication: {
        master: {
            host: process.env.DATABASE_HOST_MASTER,
            port: parseInt(process.env.DATABASE_PORT_MASTER),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
        },
        slaves: [{
            host: process.env.DATABASE_HOST_SLAVE,
            port: parseInt(process.env.DATABASE_PORT_SLAVE),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
        }],
        restoreNodeTimeout: 1700,
    },
    synchronize: true,
    /**
     * If connection fails, specifies the number of milliseconds before another connection attempt will be made.
     * If set to 0, then node will be removed instead and never re-used. (Default: 0)
     */
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);

const masterQueryRunner = dataSource.createQueryRunner('master');

const slaveQueryRunner = dataSource.createQueryRunner('slave');

export { masterQueryRunner, slaveQueryRunner }

export default dataSource;
