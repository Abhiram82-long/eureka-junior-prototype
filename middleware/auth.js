// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Optional authentication middleware (doesn't block if not authenticated)
function optionalAuth(req, res, next) {
    req.user = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;
    next();
}

// Check if user is authenticated (for redirects)
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        req.user = { id: req.session.userId, username: req.session.username };
        return true;
    }
    return false;
}

module.exports = {
    requireAuth,
    optionalAuth,
    isAuthenticated
};