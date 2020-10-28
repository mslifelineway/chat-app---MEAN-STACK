
class HelperMethod {


    // identifying errors in data received from request
    identifyErrors(errors, res) {
        //check validation errors
        if (!errors.isEmpty()) {
            let errorParam = errors.array()[0].param;
            return res.json({
                status: false,
                message: " Invalid/Missing " + errorParam + " !",
                errors: errors.array()
            });
        }
    }
}


//exporting
module.exports = HelperMethod;
