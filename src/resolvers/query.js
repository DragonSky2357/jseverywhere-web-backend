module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(100);
  },
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    const limit = 10;
    let hasNextPage = false;

    // 전달된 cursor가 없으면 기본 query는 빈 배열 할당
    // 이를 통해 DB에서 최신 노트 목록을 당겨오게 됨
    let cursorQuery = {};

    // 쿼리가 cursor 미만의 ObjectId를 가진 노트를 탐색
    if (cursor) cursorQuery = { _id: { $lt: cursor } };

    // DB에서 limit+1개의 노트를 탐색하고 최신순으로 정렬
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }

    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  },
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
