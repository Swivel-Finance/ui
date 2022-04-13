export default {
    open: true,
    watch: true,
    nodeResolve: true,
    rootDir: './',
    middleware: [
        function rewriteAssets (context, next) {

            if (context.url.startsWith('/assets/')) {

                context.url = context.url.replace('/assets/', '/src/assets/');
            }

            return next();
        },
    ],
};
