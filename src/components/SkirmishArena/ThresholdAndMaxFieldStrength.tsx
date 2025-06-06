// Battle thresholds and max field strength by battle number (1-indexed)
const battleData = [
  { battle: 1, threshold: 700, maxField: 10 },
  { battle: 2, threshold: 800, maxField: 11 },
  { battle: 3, threshold: 900, maxField: 12 },
  { battle: 4, threshold: 1000, maxField: 13 },
  { battle: 5, threshold: 1100, maxField: 14 },
  { battle: 6, threshold: 1200, maxField: 15 },
  { battle: 7, threshold: 1300, maxField: 16 },
  { battle: 8, threshold: 1400, maxField: 17 },
  { battle: 9, threshold: 1500, maxField: 18 },
  { battle: 10, threshold: 1600, maxField: 19 },
  { battle: 11, threshold: 1700, maxField: 20 },
  { battle: 12, threshold: 1800, maxField: 22 },
];

function getBattleInfo(completedMatches: number) {
  const battleNum = Math.min(completedMatches + 1, 12);
  return battleData.find(b => b.battle === battleNum) ?? battleData[battleData.length - 1];
}

export default function ThresholdAndMaxFieldStrength({ completedMatches }: { completedMatches?: number }) {
  if (completedMatches === undefined || completedMatches === null) {
    return (
      <div className="threshold-fields">
        <div>
          <strong>Threshold:</strong> --
        </div>
        <div>
          <strong>Max Field Strength:</strong> --
        </div>
        <div style={{ fontSize: '0.95em', color: '#888', marginTop: 4 }}>
          <span
            tabIndex={0}
            aria-label="Threshold and Max Field Strength values are based on completed matches only."
            title="Threshold and Max Field Strength values are based on completed matches only."
            role="img"
            onMouseDown={e => e.preventDefault()}
          >
            ℹ️
          </span>
        </div>
      </div>
    );
  }
  const battleInfo = getBattleInfo(completedMatches);
  return (
    <div className="threshold-fields">
      <div>
        <strong>Threshold:</strong> {battleInfo.threshold}
      </div>
      <div>
        <strong>Max Field Strength:</strong> {battleInfo.maxField}
      </div>
      <div style={{ fontSize: '0.95em', color: '#888', marginTop: 4 }}>
        <span
          tabIndex={0}
          aria-label="Threshold and Max Field Strength values are based on completed matches only."
          title="Threshold and Max Field Strength values are based on completed matches only."
          role="img"
          onMouseDown={e => e.preventDefault()}
        >
          ℹ️
        </span>
      </div>
    </div>
  );
}
