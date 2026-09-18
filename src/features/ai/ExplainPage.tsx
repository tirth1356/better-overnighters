import ReportExplainer from './ReportExplainer';

/**
 * Standalone home for the explanation flow so it is demoable today.
 * Person 2 owns the final placement inside the record view.
 */
export default function ExplainPage() {
  return (
    <>
      <header className="page-head">
        <h1>Understand a report</h1>
        <p>Plain-language explanations in English, हिंदी or ગુજરાતી. Never a diagnosis.</p>
      </header>
      <ReportExplainer />
    </>
  );
}
