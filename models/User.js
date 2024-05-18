const {Schema, model}= require("mongoose")

const userSchema= new Schema(
    {
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        match:[/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Valid email is required"]
    },
    thoughts:[{
        type: Schema.Types.ObjectID,
        ref:'Thought'
    }],
    friends:[{
        type:Schema.Types.ObjectID,
        ref:'User',
    }],
    },
    {
        toJSON: {
        virtuals: true,
    },
        id: false,
});

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('User', userSchema);

module.exports =  User;

