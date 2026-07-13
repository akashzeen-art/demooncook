const UNSUB_API = "http://168.144.122.72/prod/CMMTN/unsub";
const CP  = "1";
const PID = "9";

exports.handler = async function (event) {
  const msisdn = event.queryStringParameters && event.queryStringParameters.msisdn;

  if (!msisdn) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ response: "FAIL", errorMessage: "Missing msisdn" }),
    };
  }

  try {
    const res  = await fetch(`${UNSUB_API}?cp=${CP}&pid=${PID}&msisdn=${encodeURIComponent(msisdn)}`);
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
      body: JSON.stringify({ response: "FAIL", errorMessage: String(err) }),
    };
  }
};
