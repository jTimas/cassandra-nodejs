import * as cassandra from 'cassandra-driver';

export class CassandraService {
    client: any;

    constructor() {
        this.client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'db' });
    }
};

export const cassandraService = new CassandraService();
