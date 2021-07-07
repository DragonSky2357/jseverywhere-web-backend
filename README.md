# Hello World

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World'));
app.listen(4000, () => console.log('Listening on port 4000'));
```

## Nodemon

- 서버 어플리케이션의 코드가 변경되면 웹 서버를 새로 시작해야 한다.
- nodemon을 이용하면 서버를 자동으로 재시작할 수 있다.
- package.json 파일 내의 scripts 명령어를 변경하여 사용한다.
- npm run dev로 실행

```js
// package.json
"scripts":{
    ...
    "dev" : "nodemon src/index.js"
    ...
}
```

## 포트 확장 옵션

- 로컬 개발 환경에서는 문제업이 작동하나 배포할 때는 다른 포트 번호로 지정할 수 있도록 해야한다.

```js
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

```js
const {ApolloServer.gql} = require('apollo-server-express');
```

- GraphQL은 형식 정의 스키마 리졸버(resolver)로 이루어져 있다.
- 리졸버(resolver)은 쿼리와 뮤테이션(mutation)을 처리한다.

// GraphQL 스키마 구성

```js
const typeDefs = gql`
  type Query {
    name: type
  }
`;
```

// GraphQL 리졸버 구성

```js
const resolvers = {
    type Query{
        name : () => function
    }
};
```

- GraphQL API를 제공하기 위해 관련설정 및 미들웨어를 추가하고 아폴로 서버 통합한다.

```js
// 아폴로 서버 설정
server.applyMiddleware({ app, path: '/api' });

// 아폴로 GraphQL 미들웨어를 적용 및 /api로 경로 설정
const server = new ApolloServer({
  typeDefs,
  resolvers
});
```

### GraphQL 기초

#### 스키마

- 데이터와 상호작용을 글로 표현한것이다.
- GrapQL은 스키마를 필요하며, API에 대한 엄격한 계획을 강제하기 위한것이며 스키마 내에서 정의된 데이터만 반환 및 상호작용을 수행한다.
- GrapQL 스키마의 기본 구성 요소는 객체 자료형이며 5가지(String,Bollean,Int,Float,ID) 스칼라 자료형이 내장되어 있다.
- 선택적으로 입력하는 필드 값, 필수적으로 포함되어야 하는 느낌표(!)를 사용한다.

```js
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

```js
let notes = [
  { id: '1', content: 'This is a note', author: 'Adam Scott' },
  { id: '2', content: 'This is another note', author: 'Harlow Everly' },
  { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
];
```

- 스키마(GraphQL의 데이터 상호작용 방식)

```js
type Note {
    id: ID!
    content: String
    author: String!
  }
```

- 쿼리

```js
type Query {
    hello: String!
    notes:[Note!]!
  }
```

- 리졸버

```js
Query: {
    hello: () => 'Hello World',
    notes:notes
  }
```

- 쿼리 실행(http://localhost:4000/api)

```js
query{
    notes{
        id
        content
        author
    }
}
```

- 쿼리 실행 결과

```js
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

```js
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

```js
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

```js
DB_HOST = mongodb://localhost:27017/notedly
```

- src 디렉터리 내에 'db.js'생성 및 연결

```js
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

```js
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

```js
const Note = require('./note');

const models = {
  Note
};

module.exports = models;
```

- 데이터베이스 모델을 아폴로 서버 익스프레스 코드에 통합

```js
const models = require('./models');
```

- 데이터베이스에 노트를 추가하기위한 note쿼리 및 newNote 뮤테이션 업데이트

```js
// note쿼리
note: async (parent, args) => {
  return await models.Note.findById(args.id);
};

// newNote 뮤테이션
Mutation: {
  newNote: async (parent, args) => {
    return await models.Note.create({
      content: args.content,
      author: 'name'
    });
  };
}
```

# CRUD 동작

## 스키마와 리졸버 분리

**스키마 분리**

```js
// src/schema.js

const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    notes: [Note!]!
    note(id: ID): Note!
  }

  type Mutation {
    newNote(content: String!): Note
  }
`;
```

**리졸버 분리**

```js
// src/resolvers/index.js

const Query = require('./query');
const Mutation = require('./mutation');

module.exports = {
  Query,
  Mutation
};
```

**쿼리 코드용**

```js
// src/resolvers/query.js

moduble.exports = {
  notes: async () => {
    return await models.Note.find();
  },
  note: async (parent, args) => {
    return await models.Note.findById(args.id);
  }
};
```

**뮤테이션 코드**

```js
// src/resolvers/mutation.js

moduble.exports = {
  newNote: async (parent, args) => {
    return await models.Note.create({
      content: args.content,
      author: 'name'
    });
  }
};
```

- 서버가 리졸버 코드를 임포트 및 데이터베이스 모델 연결한다.
- 리졸버 모듈은 데이터베이스 모델을 참조하지만 접근할 수 없다.
- context를 호출하여 서버 코드가 리졸버에 특정 정보를 전달한다.

```js
// src/index.js

const resolvers = require('./resolvers');

...

// 아폴로 서버 설정
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:()=>{
    // context에 db models 추가
    return {models};
  }
});
```

**src/resolvers/query.js 수정**

```js
module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(100);
  },
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id);
  }
};
```

**src/resolvers/mutation.js 파일로 이동**

```js
module.exports = {
  newNote: async (parent, args, { models, user }) => {
    if (!user)
      throw new AuthenticationError('You must be signed in to create a note');

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
      favoriteCount: 0
    });
  }
};
```

## GraphQL CRUD 스키마 작성

- 업데이트와 삭제 작업은 데이터를 변경하기에 뮤테이션에 속한다.
- 업데이트하려면, 업데이트를 찾기 위한 ID 인수와 새로운 내용이 필요하다.
- 업데이트 쿼리는 새롭게 업데이트된 노트를 반환해야 한다.
- 삭제의 경우 API가 삭제 성고을 알리는 Boolean값을 반환해야 한다.

```js
type Mutation {
    newNote(content: String!): Note
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
  }
```

## GraphQL CRUD 리졸버

- 업데이트 및 삭제 하려는 항목의 id를 전달해야 한다.
- 삭제 성공시 true 실패시 false를 반환한다.

```js
// src/resolvers/mutation.js

deleteNote: async (parent, { id }, { models}) => {
    try {
      await note.remove({_id: id});
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models }) => {
    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          content
        }
      },
      {
        new: true
      }
    );
  },
```

## 날짜와 시간

- 데이터베이스 항목을 만들고 업데이트한 시간을 기록을 위해 몽구스가 자동으로 저장 요청
- createdAt 및 updatedAt 필드를 스키마에 추가한다.

```js
// src/schema.js

module.exports=gql`
  scalar DateTime // GQL 스트링 리터럴 맞춤형 스칼라 추가
`;
type Note {
    ...
    createdAt: DateTime!
    updatedAt: DateTime!
  }
```

- DateTime 자료형의 값을 요청하는 모든 리졸버 함수에 유효성 검사를 추가

```js
// src/resolvers/index.js

...

const {GraphQLDateTime} = require('graphql-iso-date');

module.exports={
  ...
  DateTime:GraphQLDateTime
};
```

# 사용자 계정과 인증

## 애플리케이션 인증 흐름

### 계정생성 흐름

1. 사용자는 UI의 필드에 자신의 이메일,사용자 이름,비밀번호를 입력한다.
2. UI는 사용자 정보와 함께 GraphQL 뮤테이션을 서버로 보낸다.
3. 서버는 비밀번호를 암호화하고 사용자 정보를 DB에 저장한다.
4. 서버는 사용자 ID가 포함된 토큰을 UI에 반환한다.
5. UI는 이 토큰을 지정된 기간 동안 저장하고, 모든 요청과 함께 서버로 보낸다.

### 로그인 흐름

1. 사용자는 자신의 이메일,사용자 이름,비밀번호를 입력한다.
2. UI는 정보와 함께 GraphQL 뮤테이션을 서버로 보낸다.
3. 서버는 DB에 저장된 비밀번호를 해독하고 사용자가 입력한 비밀번호와 비교한다.
4. 비밀번호가 일치하면 서버는 사용자 ID가 포함된 토큰을 UI로 반환한다.
5. UI는 이 토큰을 지정된 기간 동안 저장하고, 모든 요청과 함께 서버로 보낸다.

## 암호화와 토큰

### 비밀번호 암호화

- 사용자 비밀번호를 효과적으로 암호화하려면 해싱과 솔팅을 사용해야 한다.
- **해싱(hashing)** 은 텍스트 문자열을 임의로 임의의 문자열로 바꿔서 텍스트 문자열로 가려주는 행위이다.
- 해싱 함수는 **단반향**이므로 텍스트가 해싱이후 원래 문자열로 되돌릴 수 없다.
- 솔팅(salting)은 해싱을 거친 비밀번호와 함께 사용될 임의의 데이터 문자열을 생성하는 작업니다.

### bcrypt

```js
// 모듈 요청
const bcrypt = require('bcrypt');

// 데이터 솔팅을 위한 상수(default 10)
const saltRounds = 10;

// 해싱, 솔팅을 위한 함수
const passwordEncrypt = async password=>{
  return await bcrypt.hash(password,saltRounds);
};

...

// 사용자가 입력한 비밀번호
// DB에서 해싱 결과를 수신
const checkPassword = async(plainTextPassword,hashedPassword)=>{
  // 결과 true or false
  return await bcrypt.compare(hashedPassword,plainTextPassword)
};
```

### JSON 웹 토큰

- 사용자의 ID를 기기 내의 JSON 웹 토큰(JWT)에 안전하게 저장하는 방법
- 사용자가 클라이언트에 요청할 때마다 서버는 사용자를 식별하는 데 사용할 토큰을 보낸다.
- 비밀번호는 일반적으로 .env파일에 저장한다.

**헤더**  
토큰에 대한 일반적인 정보와 서명에 사용하는 알고리즘의 종류를 담고 있다.

**페이로드**  
토큰 내에 의도적으로 저장하는 정보(사용자 이름,ID등)이다.

**서명**  
토큰을 인증하는 수단에 해당한다.

# 사용자 액션

## 업데이트와 삭제 권한

```js
deleteNote,pdateNote : async(parent,{id},{models,user})=>{
  if (!user)
      throw new AuthenticationError('You must be signed in to create a note');

  const note = await models.Note.findById(id);
  if(note && String(note.author)!== user.id){
    throw new ForbiddenError("You don't have permissions to delete the note");
  }
}
```

## 사용자 쿼리

```js
// src/resolvers/query.js

module.exports = {
  // ...
  // 객체에 추가
  user: async (parent, { username }, { models }) => {
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id);
  }
};
```

## 중첩 쿼리

- 여러 쿼리를 쓰는 대신 하나의 쿼리로 필요한 데이터를 중첩시킬 수 있다.
- 데이터베이스에서 조회를 수행하는 리졸버 코드를 작성해야한다.

```js
// src/resolvers/note.js
module.exports = {
  // 요청받으면 note의 author 정보를 resolve
  author: async (note, args, { models }) => {
    return await models.User.findById(note.author);
  },
  // 요청받으면 note의 favoritedBy 정보를 resolve
  favoritedBy: async (note, args, { models }) => {
    return await models.User.find({ _id: { $in: note.favoritedBy } });
  }
};
```

```js
// src/resolvers/user.js
module.exports = {
  notes: async (user, args, { models }) => {
    return await models.Note.find({ author: user._id }).sort({ _id: -1 });
  },
  favorites: async (user, args, { models }) => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  }
};
```

```js
// src/resolvers/index.js
const Query = require('./query');
const Mutation = require('./mutation');
const Note = require('./note');
const User = require('./user');
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime
};
```

# 디테일
### 헬멧
- 소규모 보안 지향 미들웨어 함수의 모음으로 애플리케이션의 HTTP 헤더 보안을 강화한다.
- 일반적인 웹 치약점으로부터 애플리케이션을 보호하게 된다.
- 헬멧을 활성화하려면 express가 미들웨어 스택에서 일찍 사용하도록 해야한다.

```js
// ./src/index.js
const helmet = require('helmet');

// const app = express() 뒤 스택 최상단에 미들웨어 추가
app.use(helmet());
```

### CORS
- CORS(Cross-Origin Resource Sharing)은 다른 도메인에 리소스를 요청하기 위한 수단이다.
- 다른 출처로부터 자격증명을 가져오도록 설정하려고 한다.

```js
const cors = require('cors');

// app.use(helemt()); 뒤에 미들웨어 추가
app.use(cors());
```

## 페이지네시연
- 애플리케이션이 커지면 수백,수천개를 반환하는 고비용의 쿼리가 발생하므로 서버,네트워크 속도가 느려진다.
- 이러한 쿼리를 정해준 수의 결과만 반환하게 할 수 있다.
- 오프셋 페이지네이션은 오프셋 번호를 전달하고 제한된 양의 데이터를 반환하는 방식이다.
- 페이지네이션은 커서 기반으로 시간 기반 커서 또는 고유 식별자를 시작으로 전달하는 방식이다.

## 데이터 제한
- API를 통해 요청할 수 있는 데이터의 양을 제한한다.
- 서버나 데이터베이스에 과부하가 걸리는 쿼리를 방지할 수 있다.
- limit() 메서드를 설정하여 해결한다.

```js
// resolvers/query.js
notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(100);
  },
```

- 위와 같은 방법은 무제한의 깊이로 작성될 수 있다.
- 중첩되지 않은 복잡한 쿼리를 작성하는 경우에도 데이터를 반환하려면 많은 계산이 필요하다.
- 쿼리 복잡성을 제한하면 이러한 유형의 요청으로 부터 시스템을 보호할 수 있다.

```js
// ./src/index.js
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

... 

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);

    // add the db models to the context
    return { models, user };
  }
});
```

# 사용자 인터페이스와 리액트