# Hello World

```
const express = require('express');
const app = express();

app.get('/',(req,res)=>res.send('Hello World'));
app.listen(4000,()=> console.log('Listening on port 4000'));
```

## Nodemon

- 서버 어플리케이션의 코드가 변경되면 웹 서버를 새로 시작해야 한다.
- nodemon을 이용하면 서버를 자동으로 재시작할 수 있다.
- package.json 파일 내의 scripts 명령어를 변경하여 사용한다.
- npm run dev로 실행

// package.json

```
"scripts":{
    ...
    "dev" : "nodemon src/index.js"
    ...
}
```

## 포트 확장 옵션

- 로컬 개발 환경에서는 문제업이 작동하나 배포할 때는 다른 포트 번호로 지정할 수 있도록 해야한다.

```
const port = process.env.PORT || 4000;
```

## GraphQL API

- 데이터를 효율적으로 연결할 수 있고, 요청의 수와 복잡성을 줄이고 클라이언트가 필요로 하는 데이터를 제공한다.
- API를 위한 쿼리 언어이며 타입 시스템을 사용하여 쿼리를 실행하는 서버사이드 런타임이다.
- 특정한 데이터베이스나 특정한 스토리지 엔진과 관계되어 있지 않으며 기존 코드와 데이터에 의해 대체된다.

### 서버를 API로

- apollo-server-express 패키지를 사용하여 서버를 GraphQL 서버로 전환한다.
- apollo-server는 express,Connect,Hapi,Koa를 포함한 많은 Node.js 서버 프레임워크와 함께 동작하는 오픈소스 GraphQL 서버 라이브러리이다.
- 시각적인 도우미 및 GraphQL 플레이 그라운드를 제공한다.

```
const {ApolloServer.gql} = require('apollo-server-express');
```

- GraphQL은 형식 정의 스키마 리졸버(resolver)로 이루어져 있다.
- 리졸버(resolver)은 쿼리와 뮤테이션(mutation)을 처리한다.

// GraphQL 스키마 구성

```
const typeDefs = gql`
    type Query{
        name : type
    }
`;
```

// GraphQL 리졸버 구성

```
const resolvers = {
    type Query{
        name : () => function
    }
};
```

- GraphQL API를 제공하기 위해 관련설정 및 미들웨어를 추가하고 아폴로 서버 통합한다.

```
// 아폴로 서버 설정
server.applyMiddleware({ app, path: '/api' });

// 아폴로 GraphQL 미들웨어를 적용 및 /api로 경로 설정
const server = new ApolloServer({
  typeDefs,
  resolvers,

});
```

### GraphQL 기초

#### 스키마

- 데이터와 상호작용을 글로 표현한것이다.
- GrapQL은 스키마를 필요하며, API에 대한 엄격한 계획을 강제하기 위한것이며 스키마 내에서 정의된 데이터만 반환 및 상호작용을 수행한다.
- GrapQL 스키마의 기본 구성 요소는 객체 자료형이며 5가지(String,Bollean,Int,Float,ID) 스칼라 자료형이 내장되어 있다.
- 선택적으로 입력하는 필드 값, 필수적으로 포함되어야 하는 느낌표(!)를 사용한다.

```
type Pizza{
    id: ID!
    size: String!
    slices: Int!
    toppings: [String]
}
```

#### 리졸버(resolver)

- 해결사 라는 의미를 가지며 API 사용자가 요청한 데이터를 해결한다.
- 리졸버를 작성하려면 먼저 스키마에서 리졸버를 정의한 다음 JS코드 내에서 로직을 구현해야 한다.
- API에는 쿼리와 뮤테이션 두 가지의 리졸버가 포함된다.

##### 쿼리

- API에 특정 데이터를 원하는 형식으로 요청한다.
- 사용자가 요청한 데이터를 포함하는 객체를 반환한다.
- 쿼리는 데이터를 수정하지 않으며, 데이터에 접근만 허용된다.

##### 뮤테이션

- API에 특정 데이터를 수정할 때 사용한다.
- 쿼리와 마찬가지로 객체의 형태로 결과를 반환하며 일반적으로 수행한 작업의 최종 결과를 반환한다.

### API 적용하기

- notes 데이터

```
let notes = [
  {id: '1',content: 'This is a note',author: 'Adam Scott'},
  {id: '2',content: 'This is another note',author: 'Harlow Everly'},
  {id: '3',content: 'Oh hey look, another note!',author: 'Riley Harrison'}
];
```

- 스키마(GraphQL의 데이터 상호작용 방식)

```
type Note {
    id: ID!
    content: String
    author: String!
  }
```

- 쿼리

```
type Query {
    hello: String!
    notes:[Note!]!
  }
```

- 리졸버

```
Query: {
    hello: () => 'Hello World',
    notes:notes
  }
```

- 쿼리 실행(http://localhost:4000/api)

```
query{
    notes{
        id
        content
        author
    }
}
```

- 쿼리 실행 결과

```
{
    "data":{
        "notes":[
            {
              id: '1',
              content: 'This is a note',
              author: 'Adam Scott'
            },
            {
              id: '2',
              content: 'This is another note',
              author: 'Harlow Everly'
            },
            {
              id: '3',
              content: 'Oh hey look, another note!',
              author: 'Riley Harrison'
            }
        ]
    }
}
```

### 특정 값으로 요청하는 방식(Id)

- 스키마에서 인수를 사용하여 리졸버 함수에 전달한다.
- 스키마를 업데이트 이후 쿼리 리졸버를 작성할 수 있다.
- API 인수 값을 일을 수 있어야 하는데 아폴로 서버가 파라미터를 리졸버 함수에 전달한다.

#### parent

- parent 쿼리의 결과로, 쿼리를 중복으로 감쌀 때 유용하다.

### args

- 사용자가 쿼리와 함께 전달한 인수이다.

### context

- 서버 어플에서 리졸버 함수에 전달하는 정보, 현재 사용자 또는 DB정보와 같은 것이 포함된다.

### info

- 쿼리 자체에 대한 정보

#### Example

- 존재하지 않는 노트를 쿼리하면 null값을 반환

```
// 리졸버
const resolvers = {
    Query:{
        note: (parent,args)=>{
            return notes.find(note=> note.id===args.id);
        }
    }
};

// 뮤테이션
Mutation:{
    newNote : (parent,args)=>{
        let noteValue={
            id:String(notes.length+1),
            content: args.content,
            author: 'test'
        };
        notes.push(noteValue);
        return noteValue;
    }
}
// 쿼리 실행
query{
    note(id:"1"){
        id
        content
        author
    }
}
```

# 데이터베이스

## 몽고DB

- 도큐먼트(document)에 데이터를 저장한다.
- 노드 생태계와 궁합이 좋다.
- 처음 입문하는 사람도 시작하는 데 부담이 없다.

## 몽고DB 시작

```
// 몽고DB 쉘 실행
$ mongo

// use명령어로 데이터베이스 생성
$ use 'DBname'

// 도큐먼트 저장
$ db.'DBname'.save({type:'typename'}) // 성공 => WriteResult({"nInserted"})

// 도큐먼트 여러개 저장
$ db.'DBname'.save([{type:'typename'},{type:'typename'}])

// 컬렉션 조회
$ db.'DBname'.find()

// 도큐먼트 업데이트 A to B
$ db.'DBname'.update({type:'A'},{type:'B'})

// 도큐먼트 삭제
$ db.'DBname'.remove({type:'typename'})
```

## 몽고DB와 어플리케이션 연동

- API 연동하기 위해 몽구스(mongoose)사용
- 몽구스는 스키마 기반 모델링 솔루션으로 관소화하여 몽고와 쉽게 연동하게 돕는 라이브러리이다.
- .env 파일에 로컬 데이터베이스 접속 URL 변경한다.

```
DB_HOST = mongodb://localhost:27017/notedly
```

- src 디렉터리 내에 'db.js'생성 및 연결

```
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
```

- .env 설정 및 db 임포트

```
require('dotenv').config();
const db = require('./db');
```

## 어플리케이션 모델 생성

- src/models/note.js 생성

```
const mongoose = require('mongoose');

// 스키마 정의
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
```

- 모델을 임포트 하고 models 객체를 반환

```
const Note = require('./note');

const models = {
  Note
};

module.exports = models;
```

- 데이터베이스 모델을 아폴로 서버 익스프레스 코드에 통합

```
const models = require('./models');
```

- 데이터베이스에 노트를 추가하기위한 note쿼리 및 newNote 뮤테이션 업데이트

```
// note쿼리
note: async (parent, args) => {
      return await models.Note.findById(args.id);
    }

// newNote 뮤테이션
Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: 'name'
      });
    }
  }
```

# CRUD 동작
