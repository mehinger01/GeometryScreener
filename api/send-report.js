export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { studentName, reportText, readinessSummary } = req.body || {};

    if (!studentName || !reportText) {
      return res.status(400).json({ error: "Missing student name or report text." });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.REPORT_FROM_EMAIL || "onboarding@resend.dev",
        to: [process.env.REPORT_RECIPIENT_EMAIL],
        subject: `Geometry Readiness Report - ${studentName}`,
        text: reportText
      })
    });

    if (!response.ok) {
      const details = await response.json();
      return res.status(response.status).json({ error: "Email failed", details });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
