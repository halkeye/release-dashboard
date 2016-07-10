import nock from 'nock';


export function nockReleaseDashboardConfigTreesMaster() {
  nock('https://api.github.com:443', {"encodedQueryParams":true})
    .get('/repos/halkeye/release-dashboard-config/git/trees/master')
    .reply(200, ["1f8b0800000000000003ad913d6fc3201086ff0b73623e0c18bc556ac62e5dab0e071cb15b3b58860c6994ff5eac489d5329e3abd3ab7b9ebb2bc903909e58c35440c41864d77a04667454a6d3cc09a31ce3ca70a51039d991f33ad5c250ca927b4a61199be35886b36b7c9ae98a4bca7480e91b2f58d38490711f200f2ec11af63e9de278a4b541cb8a98e93f166f05d27f5cc90265a808ef8797d7b74333870a35a750678433a6a5acb95c962dbb29b99aee8ec03cd74a486d34300ce0857656472f405647109d1502a2b75b61fca9756b9f67bb9164fa30c26df7a7793f59f395d3e941512799f2cc62ab34332ae8c840e816b870280dc7d63ae510f576a7bb68dbb1679b3ecc70fbacdf5acf270f0503e9234c196fbfe075d11797020000"], { server: 'GitHub.com',
    date: 'Sun, 10 Jul 2016 03:45:43 GMT',
    'content-type': 'application/json; charset=utf-8',
    'transfer-encoding': 'chunked',
    connection: 'close',
    status: '200 OK',
    'x-ratelimit-limit': '60',
    'x-ratelimit-remaining': '18',
    'x-ratelimit-reset': '1468123424',
    'cache-control': 'public, max-age=60, s-maxage=60',
    vary: 'Accept, Accept-Encoding',
    etag: 'W/"d39361f882735e845fe1f61b2ea93dbf"',
    'last-modified': 'Sun, 10 Jul 2016 03:02:27 GMT',
    'x-github-media-type': 'github.v3',
    'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
    'access-control-allow-origin': '*',
    'content-security-policy': 'default-src \'none\'',
    'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'deny',
    'x-xss-protection': '1; mode=block',
    'x-served-by': '2811da37fbdda4367181b328b22b2499',
    'content-encoding': 'gzip',
    'x-github-request-id': 'CE746242:3986:CA585DF:5781C4E7' });
}

export function nockReleaseDashboardConfigBlob() {
  nock('https://api.github.com:443', {"encodedQueryParams":true})
    .get('/repos/halkeye/release-dashboard-config/git/blobs/b405c09e356085d6f0a263a12be481e39b5bee64')
    .reply(200, ["1f8b08000000000000039491c1729b301086df85731264308ef1cda6818850670c35028d2f08c9a02204b5b009eecb574e26874e73e949a3d1fefb7dbbfa6da8ba3056069903a7042eb39d05583a74710485b5b08b9945d87c3963b64b1cc2d8626edc198a5f99b1b21fc19d713e099dad87a1572bd32c7afe50f1a13e9387b26bcd13eb3b65d68568d8c4f44db042b17b5aa89a74c589de979d3cf2cad40993888e28f33f1c74766072d070367615f4c209679b4b39c105f4d50bf4d6157c561594a12883257fe56b9e679bb1c8d221b2fcb10cc48c24501da44ed6a4752e34f00146f13e4734207638e4d9ee3d95494cbe7bc0890438851e54babed124456cb13fc83c0b25cee290c8589412d7c4d3fc6f4f003e03e571ede06d1e3fdde04fed29b735455b41029f1f6439b9bf30724e0572ae51f6f11221f78c8374c891d3449a4311ed097fe7fee5a9d9ff987ed1215563f4a33967896a201f2bd86acfe0ed72902c8debb2a5823e89330dd289b6beba19627d96d6be3a26e3975b2c2d7fa6d956aa72145e236bdb7f9a7ff4","f7cfa475419ec502fb718d01be94edaca6b7bd7821cbad66d073eb1eb9b51fd0753dbc260e7d99763cf2d65ccf3d92c075d2c09fb0958204390067a195a351ffc5a6cdd1dbf52071b2716fbbcd76fd9f593aa7dbdac6e40193646a5e727e4a665e3a28210313193099d602002ba28cdbd9020000"], { server: 'GitHub.com',
    date: 'Sun, 10 Jul 2016 03:45:43 GMT',
    'content-type': 'application/json; charset=utf-8',
    'transfer-encoding': 'chunked',
    connection: 'close',
    status: '200 OK',
    'x-ratelimit-limit': '60',
    'x-ratelimit-remaining': '17',
    'x-ratelimit-reset': '1468123424',
    'cache-control': 'public, max-age=60, s-maxage=60',
    vary: 'Accept, Accept-Encoding',
    etag: 'W/"77fbddcc32084c561a6841388bb72b71"',
    'x-github-media-type': 'github.v3',
    'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
    'access-control-allow-origin': '*',
    'content-security-policy': 'default-src \'none\'',
    'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'deny',
    'x-xss-protection': '1; mode=block',
    'x-served-by': '139317cebd6caf9cd03889139437f00b',
    'content-encoding': 'gzip',
    'x-github-request-id': 'CE746242:3981:7BAEA21:5781C4E7' });
}
