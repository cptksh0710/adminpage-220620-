const { response } = require("express");
const sql = require("./db.js");

// 생성자
const User = function (user) {
  this.name = user.name;
  this.id = user.id;
  this.password = user.password;
  this.pass_check = user.pass_check;
};

// 사용자 튜플 추가
User.create = (newUser, result) => {
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("등록된 회원 정보: ", { no: res.insertNo, ...newUser });
    result(null, { no: res.insertNo, ...newUser });
  });
};

// 사용자 id로 조회
User.findOne = (user_id, result) => {
  sql.query("SELECT * FROM user WHERE id = ?", user_id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("발견한 사용자 id: ", res[0]);
      result(null, res[0]);
      return;
    }

    // 결과가 없을 시
    result({ kind: "찾을 수 없습니다." }, null);
  });
};

// 사용자 no로 조회
User.findById = (userNo, result) => {
  sql.query("SELECT * FROM user WHERE no = ?", userNo, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("발견한 사용자 index: ", res[0]);
      result(null, res[0]);
      return;
    }

    // 결과가 없을 시
    result({ kind: "찾을 수 없습니다." }, null);
  });
};

// 사용자 전체 조회
User.getAll = (result) => {
  sql.query("SELECT * FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("user: ", res);
    result(null, res);
  });
};

// 사용자 index number로 비밀번호 초기화
User.updateByNo = (no, user, result) => {
  sql.query(
    "UPDATE user SET password = 1234 WHERE no = ?",[no],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // 결과가 없을 시
        result({ kind: "찾을 수 없습니다" }, null);
        return;
      }

      console.log("비밀번호 초기화 회원번호: ", { no: no, ...user });
      result(null, { no: no, ...user });
    }
  );
};

// 사용자 userid로 비밀번호 변경
User.updateById = (id, user, result) => {
  if(user.password === user.pass_check){
  sql.query(
    "UPDATE user SET password = ? WHERE id = ?",
    [user.password, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // 결과가 없을 시
        result({ kind: "찾을 수 없습니다" }, null);
        return;
      }

      console.log("비밀번호 변경된 ID: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
} else{
  result({ kind: "비밀번호가 서로 다릅니다."}, null);
}
};

// 사용자 no로 삭제
User.remove = (no, result) => {
  sql.query("DELETE FROM user WHERE no = ?", no, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // 결과가 없을 시
      result({ kind: "찾을 수 없습니다." }, null);
      return;
    }

    console.log("삭제된 회원 번호:", no);
    result(null, res);
  });
};

// 사용자 전체 삭제
User.removeAll = (result) => {
  sql.query("DELETE FROM user", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // 결과가 없을 시
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted ${res.affectedRows} user");
    result(null, res);
  });
};

module.exports = User;
