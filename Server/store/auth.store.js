const hm = new Map();

function setAuth(user) {
    const id = user.username;
    hm.set(id, user) ;
}   

function getAuth(username){
    if(hm.has(username)){
        return hm.get(username);
    }
    return null;
}

module.exports = {
    setAuth,
    getAuth
}