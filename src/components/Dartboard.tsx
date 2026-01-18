import React, { useEffect, useState } from 'react';

// A map to associate score names (e.g., 'T20') with their SVG element IDs.
const scoreToIdMap: Record<string, string> = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
].reduce((acc, score) => {
  acc[score] = `s-${score}`;
  acc[`D${score}`] = `d-${score}`;
  acc[`T${score}`] = `t-${score}`;
  return acc;
}, {} as Record<string, string>);

scoreToIdMap['25'] = 'outer-bull';
scoreToIdMap['OB'] = 'outer-bull';
scoreToIdMap['50'] = 'bull';
scoreToIdMap['BULL'] = 'bull';

interface DartboardProps {
  scoresToHighlight: string[];
}

const Dartboard: React.FC<DartboardProps> = ({ scoresToHighlight }) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    fetch('/dartboard.svg')
      .then(response => response.text())
      .then(data => setSvgContent(data));
  }, []);

  useEffect(() => {
    // Clear previous highlights
    document.querySelectorAll('.segment.lit').forEach(el => {
      el.classList.remove('lit');
    });

    // Add new highlights
    scoresToHighlight.forEach(score => {
      const scoreIdentifier = score.toUpperCase();
      const segmentId = scoreToIdMap[scoreIdentifier];
      if (segmentId) {
        const segmentElement = document.getElementById(segmentId);
        segmentElement?.classList.add('lit');
      }
    });
  }, [scoresToHighlight]);

  if (!svgContent) {
    return <div>Loading Dartboard...</div>;
  }

  return <div className="dartboard-container" dangerouslySetInnerHTML={{ __html: svgContent }} />;
};

export default Dartboard;