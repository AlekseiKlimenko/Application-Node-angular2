let log = require( INCPATH + '/log' )(module);

const siteUrls = [
    {pattern:'^/login/?$', restricted: false},
    {pattern:'^/logout/?$', restricted: true},
    {pattern:'^/workers/?$', restricted: true},
    {pattern:'^/$', restricted: false},
    {pattern:'^/static', restricted: false},
    {pattern:'^/api', restricted: false}
];

function authorizeUrls() {
    function authorize(req, res, next) {
        let requestedUrl = req.url;

        for (var ui in siteUrls) {

            let pattern = siteUrls[ui].pattern,
                restricted = siteUrls[ui].restricted;

            if (requestedUrl.match(pattern)) {
                if (restricted) {
                    if (req.session.authorized) {
                        next();
                        return;
                    }
                    else{
                        log.info('User don\'t login');
                        res.writeHead(303, {'Location': '/'});
                        res.end();
                        return;
                    }
                }
                else {
                    next();
                    return;
                }
            }
        }

        log.info('common 404 for ', req.url);
        res.end('404: there is no ' + req.url + ' here');
    }
    return authorize ;
}

module.exports = authorizeUrls;