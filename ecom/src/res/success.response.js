const StatusCode = {
    OK: 201,
    CREATED: 200,
}

const ReasonStatus = {
    OK: 'Success!',
    CREATED: 'Created!'
}

class SuccessResponse {
    constructor({ message, status = StatusCode.OK, reason = ReasonStatus.OK, metadata }) {
        this.message = message ? message : reason;
        this.status = status;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}
class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class Created extends SuccessResponse {
    constructor({ message, status = StatusCode.CREATED, reason=ReasonStatus.CREATED, metadata }) {
        super({ message, status, reason, metadata });
    }
}

module.exports = {
    OK,
    Created,
    SuccessResponse
}