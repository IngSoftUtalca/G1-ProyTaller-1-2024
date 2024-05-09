async function runQuery(connection, query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error ejecutando la query: ', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    runQuery
};