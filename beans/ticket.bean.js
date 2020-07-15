class TicketBean{
    id;
    title;
    message;
    status; //  = 'created' | 'pending' | 'done' | 'standby'
    type; // 'bug' | 'request'
    comments;
    created_at;

    //TODO author

    constructor(id, title, message, status, type, comments, created_at) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.status = status;
        this.type = type;
        this.comments = comments;
        this.created_at = created_at;
    }

}
module.exports = TicketBean;
