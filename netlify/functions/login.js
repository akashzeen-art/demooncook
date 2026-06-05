const LOGIN_API = "http://168.144.122.72/prod/CPLogin/CMMTN";
const PID = "1";

exports.handler = async function (event) {
  const msisdn = event.queryStringParameters && event.queryStringParameters.msisdn;
  const sid    = event.queryStringParameters && event.queryStringParameters.sid;

  if (!msisdn && !sid) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ response: "ERROR", error: "Missing msisdn or sid" }),
    };
  }

  try {
    const param = msisdn
      ? `msisdn=${encodeURIComponent(msisdn)}`
      : `sid=${encodeURIComponent(sid)}`;

    const res  = await fetch(`${LOGIN_API}?pid=${PID}&${param}`);
    const text = await res.text();
    const data = JSON.parse(text);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ response: "ERROR", error: String(err) }),
    };
  }
};
