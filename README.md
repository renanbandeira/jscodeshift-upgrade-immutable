# jscodeshift-upgrade-immutable
codemod to use fromJS before merge calls

# Motivation

Since there was a huge breaking change from [immutableJS](https://github.com/facebook/immutable-js/) v3 to v4 which `merge` calls won't convert objects to immutable anymore, this codemod was created to convert `merge` arguments to immutable object in order to retain the same behavior as immutable v3.

Feel free to contribute if you find anything that could improve
