const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const newGroups = `const GROUPS = {
  A: {
    name: "Group A",
    teams: [
      { id: "MEX", name: "Mexico", flag: "🇲🇽", rating: 78, code: "mx" },
      { id: "RSA", name: "South Africa", flag: "🇿🇦", rating: 72, code: "za" },
      { id: "KOR", name: "South Korea", flag: "🇰🇷", rating: 80, code: "kr" },
      { id: "CZE", name: "Czechia", flag: "🇨🇿", rating: 77, code: "cz" }
    ]
  },
  B: {
    name: "Group B",
    teams: [
      { id: "CAN", name: "Canada", flag: "🇨🇦", rating: 75, code: "ca" },
      { id: "BIH", name: "Bosnia & Herz.", flag: "🇧🇦", rating: 74, code: "ba" },
      { id: "QAT", name: "Qatar", flag: "🇶🇦", rating: 68, code: "qa" },
      { id: "SUI", name: "Switzerland", flag: "🇨🇭", rating: 81, code: "ch" }
    ]
  },
  C: {
    name: "Group C",
    teams: [
      { id: "BRA", name: "Brazil", flag: "🇧🇷", rating: 88, code: "br" },
      { id: "MAR", name: "Morocco", flag: "🇲🇦", rating: 83, code: "ma" },
      { id: "HAI", name: "Haiti", flag: "🇭🇹", rating: 65, code: "ht" },
      { id: "SCO", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", rating: 75, code: "gb-sct" }
    ]
  },
  D: {
    name: "Group D",
    teams: [
      { id: "USA", name: "United States", flag: "🇺🇸", rating: 81, code: "us" },
      { id: "PAR", name: "Paraguay", flag: "🇵🇾", rating: 73, code: "py" },
      { id: "AUS", name: "Australia", flag: "🇦🇺", rating: 76, code: "au" },
      { id: "TUR", name: "Türkiye", flag: "🇹🇷", rating: 79, code: "tr" }
    ]
  },
  E: {
    name: "Group E",
    teams: [
      { id: "GER", name: "Germany", flag: "🇩🇪", rating: 85, code: "de" },
      { id: "CUW", name: "Curaçao", flag: "🇨🇼", rating: 64, code: "cw" },
      { id: "CIV", name: "Ivory Coast", flag: "🇨🇮", rating: 78, code: "ci" },
      { id: "ECU", name: "Ecuador", flag: "🇪🇨", rating: 77, code: "ec" }
    ]
  },
  F: {
    name: "Group F",
    teams: [
      { id: "NED", name: "Netherlands", flag: "🇳🇱", rating: 84, code: "nl" },
      { id: "JPN", name: "Japan", flag: "🇯🇵", rating: 81, code: "jp" },
      { id: "SWE", name: "Sweden", flag: "🇸🇪", rating: 78, code: "se" },
      { id: "TUN", name: "Tunisia", flag: "🇹🇳", rating: 71, code: "tn" }
    ]
  },
  G: {
    name: "Group G",
    teams: [
      { id: "BEL", name: "Belgium", flag: "🇧🇪", rating: 83, code: "be" },
      { id: "EGY", name: "Egypt", flag: "🇪🇬", rating: 77, code: "eg" },
      { id: "IRN", name: "Iran", flag: "🇮🇷", rating: 74, code: "ir" },
      { id: "NZL", name: "New Zealand", flag: "🇳🇿", rating: 66, code: "nz" }
    ]
  },
  H: {
    name: "Group H",
    teams: [
      { id: "ESP", name: "Spain", flag: "🇪🇸", rating: 87, code: "es" },
      { id: "CPV", name: "Cabo Verde", flag: "🇨🇻", rating: 70, code: "cv" },
      { id: "KSA", name: "Saudi Arabia", flag: "🇸🇦", rating: 72, code: "sa" },
      { id: "URU", name: "Uruguay", flag: "🇺🇾", rating: 82, code: "uy" }
    ]
  },
  I: {
    name: "Group I",
    teams: [
      { id: "FRA", name: "France", flag: "🇫🇷", rating: 89, code: "fr" },
      { id: "SEN", name: "Senegal", flag: "🇸🇳", rating: 80, code: "sn" },
      { id: "IRQ", name: "Iraq", flag: "🇮🇶", rating: 69, code: "iq" },
      { id: "NOR", name: "Norway", flag: "🇳🇴", rating: 78, code: "no" }
    ]
  },
  J: {
    name: "Group J",
    teams: [
      { id: "ARG", name: "Argentina", flag: "🇦🇷", rating: 89, code: "ar" },
      { id: "ALG", name: "Algeria", flag: "🇩🇿", rating: 76, code: "dz" },
      { id: "AUT", name: "Austria", flag: "🇦🇹", rating: 78, code: "at" },
      { id: "JOR", name: "Jordan", flag: "🇯🇴", rating: 68, code: "jo" }
    ]
  },
  K: {
    name: "Group K",
    teams: [
      { id: "POR", name: "Portugal", flag: "🇵🇹", rating: 86, code: "pt" },
      { id: "COD", name: "DR Congo", flag: "🇨🇩", rating: 73, code: "cd" },
      { id: "UZB", name: "Uzbekistan", flag: "🇺🇿", rating: 71, code: "uz" },
      { id: "COL", name: "Colombia", flag: "🇨🇴", rating: 82, code: "co" }
    ]
  },
  L: {
    name: "Group L",
    teams: [
      { id: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rating: 87, code: "gb-eng" },
      { id: "CRO", name: "Croatia", flag: "🇭🇷", rating: 81, code: "hr" },
      { id: "GHA", name: "Ghana", flag: "🇬🇭", rating: 74, code: "gh" },
      { id: "PAN", name: "Panama", flag: "🇵🇦", rating: 70, code: "pa" }
    ]
  }
};

const TeamFlag = ({ team }) => {
  if (!team || !team.code) return <span className="team-flag">{team?.flag || "🏳️"}</span>;
  return (
    <img 
      src={\`https://flagcdn.com/24x18/\${team.code}.png\`} 
      srcSet={\`https://flagcdn.com/48x36/\${team.code}.png 2x, https://flagcdn.com/72x54/\${team.code}.png 3x\`}
      width="24" 
      height="18" 
      alt={team.name} 
      className="team-flag-img" 
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }} 
    />
  );
};`;

code = code.replace(/const GROUPS = \{[\s\S]*?\n\};\n/, newGroups + '\n\n');
code = code.replace(/<span className="team-flag">\{team\.flag\}<\/span>/g, '<TeamFlag team={team} />');
code = code.replace(/<span className="team-flag">\{teamA\.flag\}<\/span>/g, '<TeamFlag team={teamA} />');
code = code.replace(/<span className="team-flag">\{teamB\.flag\}<\/span>/g, '<TeamFlag team={teamB} />');
code = code.replace(/<span>\{player\.champTeam\.flag\}<\/span>/g, '<TeamFlag team={player.champTeam} />');
code = code.replace(/\{team\.flag\}\s*\{team\.name\}/g, '<TeamFlag team={team} /> {team.name}');
code = code.replace(/\{predWinner\.flag\}\s*\{predWinner\.name\}/g, '<TeamFlag team={predWinner} /> {predWinner.name}');

// Handle host badges manually
code = code.replace(/<span className="flag">🇨🇦<\/span>/g, '<img src="https://flagcdn.com/24x18/ca.png" width="24" height="18" style={{display:"inline-block", verticalAlign:"middle", marginRight:"6px", borderRadius:"2px"}} />');
code = code.replace(/<span className="flag">🇲🇽<\/span>/g, '<img src="https://flagcdn.com/24x18/mx.png" width="24" height="18" style={{display:"inline-block", verticalAlign:"middle", marginRight:"6px", borderRadius:"2px"}} />');
code = code.replace(/<span className="flag">🇺🇸<\/span>/g, '<img src="https://flagcdn.com/24x18/us.png" width="24" height="18" style={{display:"inline-block", verticalAlign:"middle", marginRight:"6px", borderRadius:"2px"}} />');

fs.writeFileSync('src/App.jsx', code);
console.log('Successfully updated App.jsx with TeamFlag component');
