module.exports = {
	port: process.env.PORT || 8123,
	db: {
		host: process.env.DATABASE_HOST || 'mysql',
		database: 'croton',
		user: 'lingtelli',
		password: 'lingtelli',
		port: 3306
	}
};
