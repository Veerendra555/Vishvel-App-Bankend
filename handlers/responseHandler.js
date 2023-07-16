module.exports = (code, data) => {
    if(code == 500 || code == 400 || code == 409 || code == 422){
        return {
            code,
            status: "failure",
            error: data
        }
    }
    else if(code == 200 || code == 201 || code == 204){
        return {
            code: code,
            status: "success",
            response: data
        }
    }
};