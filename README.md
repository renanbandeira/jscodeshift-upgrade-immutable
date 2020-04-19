# jscodeshift-upgrade-immutable
codemod to use fromJS before merge calls

# Motivation

Since there was a huge breaking change from [immutableJS](https://github.com/facebook/immutable-js/) v3 to v4 which `merge` calls won't convert objects to immutable anymore, this codemod was created to convert `merge` arguments to immutable object in order to garantee the same behavior as immutable v3.

# Supported Merge functions

Only `merge`and `mergeDeep` is supported. Feel free to contribute with `mergeIn`, `mergeDeepIn`, `mergeDeepWith`, `mergeWith` support.
