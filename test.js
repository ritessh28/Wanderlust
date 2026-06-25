const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.z3i7sdb.mongodb.net",
  (err, records) => {
    console.log("Error:", err);
    console.log("Records:", records);
  }
);