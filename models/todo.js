const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  value: String, // 할 일이 어떤 것인지 확인하는 칼럼
  doneAt: Date, // 할 일이 언제 완료되었는지,
  order: Number, // 몇 번째 할 일인지
});

TodoSchema.virtual('todoId').get(function () {
  return this._id.toHexString();
});

TodoSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Todo', TodoSchema);
