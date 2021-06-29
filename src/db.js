const mongose = require('mongoose');

module.exports = {
  connect: DB_HOST => {
    // 몽고 드라이버의 업데이트된 URL 스프링 Parser 사용
    mongose.set('useNewUrlParser', true);
    // findAndModify() 대신 findOneAndUpdate() 사용
    mongose.set('useFindAndModify', false);
    // ensureIndex() 대신 createIndex() 사용
    mongose.set('useCreateIndex', true);
    // 새로운 서버 디스커버리 및 모니터링 엔진 사용
    mongose.set('useUnifiedTopology', true);
    // DB에 연결
    mongose.connect(DB_HOST);
    // 연결 실패시
    mongose.connection.on('error', err => {
      console.error(err);
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running'
      );
      process.exit();
    });
  },
  close: () => {
    mongose.connection.close();
  }
};
