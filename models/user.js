const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: false, //이거 바꾼다고 db가 바뀌지 않음 workbench에서 직접 바꿔줘야함
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true, //true로 하면 createdAt, updatedAt이 생김
            underscored: false,
            modelName: 'User', //Js에서 사용하는 이름
            tableName: 'users', //db에서 사용하는 이름
            paranoid: true, //deletedAt 유저 삭제일
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
}

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { //팔로워
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        })
        db.User.belongsToMany(db.User, { //팔로잉
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        })
    }
}

module.exports = User;
