const { DEFAULT_LIMIT, MAX_LIMIT, DEFAULT_PAGE } = require('../../constants/default-query');
const userModel = require('../schemas/user.schema');


const normalizePaging = ({ page, limit, skip }) => {
    let _limit = Number(limit) || DEFAULT_LIMIT;
    if (_limit > MAX_LIMIT) _limit = MAX_LIMIT;
    if (_limit < 1) _limit = DEFAULT_LIMIT;

    let _skip = Number(skip);
    if(Number.isNaN(_skip) || _skip < 0){
        const _page = Number(page) || DEFAULT_PAGE;
        _skip = (_page - 1) * _limit;
    }
    return { skip: _skip, limit: _limit, page: _page }

}
