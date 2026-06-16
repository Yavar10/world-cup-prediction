import { useState, useEffect, useCallback } from 'react';
import { 
  Trophy, 
  Users, 
  Settings, 
  HelpCircle, 
  LogIn, 
  LogOut, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Clock,
  ArrowBigUp,
  ArrowBigDown
} from 'lucide-react';
import { auth, db, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, updateDoc } from 'firebase/firestore';

// ==========================================
// 1. DATA CONSTANTS & SETUP
// ==========================================

// Add your real Google email address to the .env file as VITE_ADMIN_EMAIL to unlock the Admin Panel!
const ADMIN_EMAILS = [
  import.meta.env.VITE_ADMIN_EMAIL
].filter(Boolean);

const GROUPS = {
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
      src={`https://flagcdn.com/24x18/${team.code}.png`} 
      srcSet={`https://flagcdn.com/48x36/${team.code}.png 2x, https://flagcdn.com/72x54/${team.code}.png 3x`}
      width="24" 
      height="18" 
      alt={team.name} 
      className="team-flag-img" 
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }} 
    />
  );
};


// Bracket matchups for the Round of 32
const KNOCKOUT_MATCHES = {
  // Round of 32 (Matches 73 to 88)
  73: { id: 73, round: "R32", title: "Match 73", teamA_src: "Runner-up Group A", teamB_src: "Runner-up Group B", prevA: { type: "group", group: "A", pos: 2 }, prevB: { type: "group", group: "B", pos: 2 } },
  74: { id: 74, round: "R32", title: "Match 74", teamA_src: "Winner Group E", teamB_src: "3rd Place Team 1", prevA: { type: "group", group: "E", pos: 1 }, prevB: { type: "third", index: 0 } },
  75: { id: 75, round: "R32", title: "Match 75", teamA_src: "Winner Group F", teamB_src: "Runner-up Group C", prevA: { type: "group", group: "F", pos: 1 }, prevB: { type: "group", group: "C", pos: 2 } },
  76: { id: 76, round: "R32", title: "Match 76", teamA_src: "Winner Group C", teamB_src: "Runner-up Group F", prevA: { type: "group", group: "C", pos: 1 }, prevB: { type: "group", group: "F", pos: 2 } },
  77: { id: 77, round: "R32", title: "Match 77", teamA_src: "Winner Group I", teamB_src: "3rd Place Team 2", prevA: { type: "group", group: "I", pos: 1 }, prevB: { type: "third", index: 1 } },
  78: { id: 78, round: "R32", title: "Match 78", teamA_src: "Runner-up Group E", teamB_src: "Runner-up Group I", prevA: { type: "group", group: "E", pos: 2 }, prevB: { type: "group", group: "I", pos: 2 } },
  79: { id: 79, round: "R32", title: "Match 79", teamA_src: "Winner Group A", teamB_src: "3rd Place Team 3", prevA: { type: "group", group: "A", pos: 1 }, prevB: { type: "third", index: 2 } },
  80: { id: 80, round: "R32", title: "Match 80", teamA_src: "Winner Group L", teamB_src: "3rd Place Team 4", prevA: { type: "group", group: "L", pos: 1 }, prevB: { type: "third", index: 3 } },
  81: { id: 81, round: "R32", title: "Match 81", teamA_src: "Winner Group G", teamB_src: "3rd Place Team 5", prevA: { type: "group", group: "G", pos: 1 }, prevB: { type: "third", index: 4 } },
  82: { id: 82, round: "R32", title: "Match 82", teamA_src: "Winner Group D", teamB_src: "3rd Place Team 6", prevA: { type: "group", group: "D", pos: 1 }, prevB: { type: "third", index: 5 } },
  83: { id: 83, round: "R32", title: "Match 83", teamA_src: "Winner Group H", teamB_src: "Runner-up Group J", prevA: { type: "group", group: "H", pos: 1 }, prevB: { type: "group", group: "J", pos: 2 } },
  84: { id: 84, round: "R32", title: "Match 84", teamA_src: "Runner-up Group K", teamB_src: "Runner-up Group L", prevA: { type: "group", group: "K", pos: 2 }, prevB: { type: "group", group: "L", pos: 2 } },
  85: { id: 85, round: "R32", title: "Match 85", teamA_src: "Winner Group B", teamB_src: "3rd Place Team 7", prevA: { type: "group", group: "B", pos: 1 }, prevB: { type: "third", index: 6 } },
  86: { id: 86, round: "R32", title: "Match 86", teamA_src: "Runner-up Group D", teamB_src: "Runner-up Group G", prevA: { type: "group", group: "D", pos: 2 }, prevB: { type: "group", group: "G", pos: 2 } },
  87: { id: 87, round: "R32", title: "Match 87", teamA_src: "Winner Group J", teamB_src: "Runner-up Group H", prevA: { type: "group", group: "J", pos: 1 }, prevB: { type: "group", group: "H", pos: 2 } },
  88: { id: 88, round: "R32", title: "Match 88", teamA_src: "Winner Group K", teamB_src: "3rd Place Team 8", prevA: { type: "group", group: "K", pos: 1 }, prevB: { type: "third", index: 7 } },

  // Round of 16 (Matches 89 to 96)
  89: { id: 89, round: "R16", title: "Match 89", teamA_src: "Winner Match 73", teamB_src: "Winner Match 74", prevA: { type: "match", matchId: 73 }, prevB: { type: "match", matchId: 74 } },
  90: { id: 90, round: "R16", title: "Match 90", teamA_src: "Winner Match 75", teamB_src: "Winner Match 76", prevA: { type: "match", matchId: 75 }, prevB: { type: "match", matchId: 76 } },
  91: { id: 91, round: "R16", title: "Match 91", teamA_src: "Winner Match 77", teamB_src: "Winner Match 78", prevA: { type: "match", matchId: 77 }, prevB: { type: "match", matchId: 78 } },
  92: { id: 92, round: "R16", title: "Match 92", teamA_src: "Winner Match 79", teamB_src: "Winner Match 80", prevA: { type: "match", matchId: 79 }, prevB: { type: "match", matchId: 80 } },
  93: { id: 93, round: "R16", title: "Match 93", teamA_src: "Winner Match 81", teamB_src: "Winner Match 82", prevA: { type: "match", matchId: 81 }, prevB: { type: "match", matchId: 82 } },
  94: { id: 94, round: "R16", title: "Match 94", teamA_src: "Winner Match 83", teamB_src: "Winner Match 84", prevA: { type: "match", matchId: 83 }, prevB: { type: "match", matchId: 84 } },
  95: { id: 95, round: "R16", title: "Match 95", teamA_src: "Winner Match 85", teamB_src: "Winner Match 86", prevA: { type: "match", matchId: 85 }, prevB: { type: "match", matchId: 86 } },
  96: { id: 96, round: "R16", title: "Match 96", teamA_src: "Winner Match 87", teamB_src: "Winner Match 88", prevA: { type: "match", matchId: 87 }, prevB: { type: "match", matchId: 88 } },

  // Quarterfinals (Matches 97 to 100)
  97: { id: 97, round: "QF", title: "Match 97", teamA_src: "Winner Match 89", teamB_src: "Winner Match 90", prevA: { type: "match", matchId: 89 }, prevB: { type: "match", matchId: 90 } },
  98: { id: 98, round: "QF", title: "Match 98", teamA_src: "Winner Match 91", teamB_src: "Winner Match 92", prevA: { type: "match", matchId: 91 }, prevB: { type: "match", matchId: 92 } },
  99: { id: 99, round: "QF", title: "Match 99", teamA_src: "Winner Match 93", teamB_src: "Winner Match 94", prevA: { type: "match", matchId: 93 }, prevB: { type: "match", matchId: 94 } },
  100: { id: 100, round: "QF", title: "Match 100", teamA_src: "Winner Match 95", teamB_src: "Winner Match 96", prevA: { type: "match", matchId: 95 }, prevB: { type: "match", matchId: 96 } },

  // Semifinals (Matches 101 to 102)
  101: { id: 101, round: "SF", title: "Match 101", teamA_src: "Winner Match 97", teamB_src: "Winner Match 98", prevA: { type: "match", matchId: 97 }, prevB: { type: "match", matchId: 98 } },
  102: { id: 102, round: "SF", title: "Match 102", teamA_src: "Winner Match 99", teamB_src: "Winner Match 100", prevA: { type: "match", matchId: 99 }, prevB: { type: "match", matchId: 100 } },

  // 3rd Place Match (103) & Final (104)
  103: { id: 103, round: "3RD", title: "3rd Place Match", teamA_src: "Loser Match 101", teamB_src: "Loser Match 102", prevA: { type: "loser", matchId: 101 }, prevB: { type: "loser", matchId: 102 } },
  104: { id: 104, round: "FI", title: "Final", teamA_src: "Winner Match 101", teamB_src: "Winner Match 102", prevA: { type: "match", matchId: 101 }, prevB: { type: "match", matchId: 102 } }
};

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function getTeamById(teamId) {
  if (!teamId) return null;
  for (const groupKey in GROUPS) {
    const team = GROUPS[groupKey].teams.find(t => t.id === teamId);
    if (team) return team;
  }
  return null;
}

function resolveTeamsForMatch(matchId, predictions) {
  const match = KNOCKOUT_MATCHES[matchId];
  if (!match) return { teamA: null, teamB: null };

  const getTeamFromSource = (source) => {
    if (!source) return null;
    if (source.type === "group") {
      const groupStandings = predictions.groups[source.group];
      if (!groupStandings) return null;
      const teamId = groupStandings[source.pos - 1];
      return getTeamById(teamId);
    } else if (source.type === "third") {
      const selectedThirds = predictions.bestThirds;
      if (!selectedThirds || selectedThirds.length <= source.index) return null;
      const teamId = selectedThirds[source.index];
      return getTeamById(teamId);
    } else if (source.type === "match") {
      const winnerId = predictions.knockout[source.matchId];
      if (!winnerId) return null;
      return getTeamById(winnerId);
    } else if (source.type === "loser") {
      const { teamA, teamB } = resolveTeamsForMatch(source.matchId, predictions);
      const winnerId = predictions.knockout[source.matchId];
      if (!teamA || !teamB || !winnerId) return null;
      return teamA.id === winnerId ? teamB : teamA;
    }
    return null;
  };

  const teamA = getTeamFromSource(match.prevA);
  const teamB = getTeamFromSource(match.prevB);

  return { teamA, teamB };
}

// Cascade resets invalid predicted winners
function sanitizePredictions(preds) {
  const sanitizedKnockout = { ...preds.knockout };
  const updatedPreds = { ...preds, knockout: sanitizedKnockout };

  for (let matchId = 73; matchId <= 104; matchId++) {
    const { teamA, teamB } = resolveTeamsForMatch(matchId, updatedPreds);
    const currentWinnerId = sanitizedKnockout[matchId];
    
    if (currentWinnerId) {
      const teamAId = teamA ? teamA.id : null;
      const teamBId = teamB ? teamB.id : null;
      if (currentWinnerId !== teamAId && currentWinnerId !== teamBId) {
        sanitizedKnockout[matchId] = "";
      }
    } else {
      sanitizedKnockout[matchId] = "";
    }
  }
  
  return updatedPreds;
}

// Create blank predictions object
function createInitialPredictions() {
  const groups = {};
  for (const key in GROUPS) {
    groups[key] = GROUPS[key].teams.map(t => t.id);
  }
  
  const knockout = {};
  for (const mId in KNOCKOUT_MATCHES) {
    knockout[mId] = "";
  }

  return {
    groups,
    bestThirds: [],
    knockout
  };
}

// Check if a predicted tree is fully completed
function isPredictionComplete(preds) {
  // 1. Group stages are always populated by default (order exists)
  // 2. Best thirds must have exactly 8 selected
  if (preds.bestThirds.length !== 8) return false;
  // 3. All knockout matches must have a predicted winner
  for (let mId = 73; mId <= 104; mId++) {
    if (!preds.knockout[mId]) return false;
  }
  return true;
}

// Calculate prediction score based on official results
function calculateScore(preds, official) {
  let groupsScore = 0;
  let bestThirdsScore = 0;
  let knockoutScore = 0;

  // 1. Group Standings
  for (const groupKey in GROUPS) {
    const predOrder = preds.groups[groupKey] || [];
    const offOrder = official.groups[groupKey] || [];
    
    if (offOrder.length === 4) {
      predOrder.forEach((teamId, index) => {
        const offIndex = offOrder.indexOf(teamId);
        if (offIndex === index) {
          groupsScore += 2; // Exact position
        } else if (
          (index < 2 && offIndex < 2) || // Predicted top-2, actually top-2
          (index === 2 && preds.bestThirds.includes(teamId) && offIndex === 2 && official.bestThirds.includes(teamId))
        ) {
          groupsScore += 1; // Qualified but wrong spot
        }
      });
    }
  }

  // 2. Best Third Place Teams
  preds.bestThirds.forEach(teamId => {
    if (official.bestThirds.includes(teamId)) {
      bestThirdsScore += 2;
    }
  });

  // 3. Knockouts
  for (let matchId = 73; matchId <= 104; matchId++) {
    const match = KNOCKOUT_MATCHES[matchId];
    
    const { teamA: predA, teamB: predB } = resolveTeamsForMatch(matchId, preds);
    const predWinner = preds.knockout[matchId];
    
    const { teamA: offA, teamB: offB } = resolveTeamsForMatch(matchId, official);
    const offWinner = official.knockout[matchId];

    // Check if match actually played in official tournament
    if (offWinner && offA && offB) {
      // Correct Winner Points
      if (predWinner === offWinner) {
        if (matchId <= 88) knockoutScore += 5;       // R32
        else if (matchId <= 96) knockoutScore += 8;  // R16
        else if (matchId <= 100) knockoutScore += 12; // QF
        else if (matchId <= 102) knockoutScore += 20; // SF
        else if (matchId === 103) knockoutScore += 15; // 3RD
        else if (matchId === 104) knockoutScore += 30; // Champion
      }

      // Correct finalist (for Final 104) or runner-up
      if (matchId === 104) {
        const predRunnerUp = predWinner === (predA?.id) ? predB?.id : predA?.id;
        const offRunnerUp = offWinner === (offA?.id) ? offB?.id : offA?.id;
        if (predRunnerUp && predRunnerUp === offRunnerUp) {
          knockoutScore += 20; // Correct Runner-up
        }

        // Correct finalists points (+10 per team that made the final)
        const offFinalists = [offA.id, offB.id];
        if (predA && offFinalists.includes(predA.id)) knockoutScore += 10;
        if (predB && offFinalists.includes(predB.id)) knockoutScore += 10;
      } else {
        // Participant points (+2, +3, +4, +6 depending on round)
        const offParticipants = [offA.id, offB.id];
        let participantBonus = 0;
        if (matchId <= 88) participantBonus = 2;
        else if (matchId <= 96) participantBonus = 3;
        else if (matchId <= 100) participantBonus = 4;
        else if (matchId <= 102) participantBonus = 6;
        else if (matchId === 103) participantBonus = 8;

        if (predA && offParticipants.includes(predA.id)) knockoutScore += participantBonus;
        if (predB && offParticipants.includes(predB.id)) knockoutScore += participantBonus;
      }
    }
  }

  return {
    groups: groupsScore,
    bestThirds: bestThirdsScore,
    knockout: knockoutScore,
    total: groupsScore + bestThirdsScore + knockoutScore
  };
}

// Simulate a full tournament based on ratings and luck (100 = average rating, 0-30 = random luck spread)
function simulateFullTournament(biasTeamId = null, biasBoost = 0) {
  const simulated = {
    groups: {},
    bestThirds: [],
    knockout: {}
  };

  const getSimulatedRating = (team, biasId, boost) => {
    const base = team.rating;
    const randomFactor = (Math.random() - 0.5) * 25; // Random swing (-12.5 to +12.5)
    const biasFactor = (team.id === biasId) ? boost : 0;
    return base + randomFactor + biasFactor;
  };

  // 1. Simulate Groups
  const groupThirds = [];
  for (const groupKey in GROUPS) {
    const groupTeams = [...GROUPS[groupKey].teams];
    groupTeams.sort((a, b) => {
      return getSimulatedRating(b, biasTeamId, biasBoost) - getSimulatedRating(a, biasTeamId, biasBoost);
    });
    
    simulated.groups[groupKey] = groupTeams.map(t => t.id);
    groupThirds.push({
      teamId: groupTeams[2].id,
      rating: groupTeams[2].rating + (groupTeams[2].id === biasTeamId ? biasBoost : 0)
    });
  }

  // 2. Select top 8 3rd-placed teams
  groupThirds.sort((a, b) => {
    const rA = a.rating + (Math.random() - 0.5) * 10;
    const rB = b.rating + (Math.random() - 0.5) * 10;
    return rB - rA;
  });
  simulated.bestThirds = groupThirds.slice(0, 8).map(x => x.teamId);

  // 3. Simulate Knockout Bracket
  for (let matchId = 73; matchId <= 104; matchId++) {
    const { teamA, teamB } = resolveTeamsForMatch(matchId, simulated);
    
    if (teamA && teamB) {
      const ratA = getSimulatedRating(teamA, biasTeamId, biasBoost);
      const ratB = getSimulatedRating(teamB, biasTeamId, biasBoost);
      
      // Determine winner
      simulated.knockout[matchId] = ratA > ratB ? teamA.id : teamB.id;
    } else {
      simulated.knockout[matchId] = "";
    }
  }

  return simulated;
}

// Mock users pre-seeded database generator
const MOCK_PLAYERS_INFO = [
  { name: "Diego Maradona", email: "diego.handofgod@gmail.com", biasTeam: "ARG", luck: 20, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=diego&backgroundColor=b6e3f4" },
  { name: "Pelé", email: "pele.king@cbf.org", biasTeam: "BRA", luck: 10, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=pele&backgroundColor=d1c4e9" },
  { name: "Gary Lineker", email: "gary.crisps@bbc.co.uk", biasTeam: "ENG", luck: 15, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=gary&backgroundColor=ffecb3" },
  { name: "Alex Morgan", email: "alex.morgan@uswnt.com", biasTeam: "USA", luck: 12, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=alex&backgroundColor=f8bbd0" },
  { name: "Lionel Messi", email: "leomessi10@intermiami.com", biasTeam: "ARG", luck: 5, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=messi&backgroundColor=c8e6c9" },
  { name: "Cristiano Ronaldo", email: "cr7.siuuu@alnassr.sa", biasTeam: "POR", luck: 8, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ronaldo&backgroundColor=ffcc80" }
];

// ==========================================
// 3. MAIN APP COMPONENT
// ==========================================

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null); // 'chooser' | 'google' | 'auth0'
  const [simulatedLoading, setSimulatedLoading] = useState(false);
  const [simulatedAccountInput, setSimulatedAccountInput] = useState('');
  const [simulatedEmailInput, setSimulatedEmailInput] = useState('');
  const [simulatedPasswordInput, setSimulatedPasswordInput] = useState('');

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState('predict');
  
  // Enforce Admin Tab Security
  const isUserAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);
  useEffect(() => {
    if (activeTab === 'admin' && !isUserAdmin) {
      setActiveTab('predict');
    }
  }, [activeTab, isUserAdmin]);

  // Predictor Flow State
  const [predictorStep, setPredictorStep] = useState(0);
  const [activeBracketRound, setActiveBracketRound] = useState('R32');
  const [adminBracketRound, setAdminBracketRound] = useState('R32');
  const [userPredictions, setUserPredictions] = useState(createInitialPredictions());
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Official Results State
  const [officialResults, setOfficialResults] = useState(createInitialPredictions());

  // Global Leaderboard Database
  const [leaderboard, setLeaderboard] = useState([]);
  
  // Modal for viewing other user's predictions details
  const [viewingUserDetail, setViewingUserDetail] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Toast Alerts State
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = {
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          avatar: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.email)}&backgroundColor=00f076`
        };
        setCurrentUser(userProfile);
        
        // Fetch user's predictions
        const docRef = doc(db, 'users', user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserPredictions(docSnap.data().predictions);
          setHasSubmitted(docSnap.data().hasSubmittedOfficial || false);
        } else {
          const initPreds = createInitialPredictions();
          setUserPredictions(initPreds);
          setHasSubmitted(false);
          await setDoc(docRef, {
            id: user.email,
            name: userProfile.name,
            email: userProfile.email,
            avatar: userProfile.avatar,
            predictions: initPreds,
            isMock: false,
            scoreBreakdown: { groups: 0, bestThirds: 0, knockout: 0, total: 0 }
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Firebase Leaderboard Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push(doc.data());
      });
      setLeaderboard(usersData);
    });
    return unsubscribe;
  }, []);

  // Firebase Official Results Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'admin', 'officialResults'), (docSnap) => {
      if (docSnap.exists()) {
        setOfficialResults(docSnap.data().data);
      } else {
        const initial = createInitialPredictions();
        setDoc(doc(db, 'admin', 'officialResults'), { data: initial });
        setOfficialResults(initial);
      }
    });
    return unsubscribe;
  }, []);

  // Seed mock players to Firebase if not exists
  useEffect(() => {
    MOCK_PLAYERS_INFO.forEach(async (player) => {
      const playerDoc = doc(db, 'users', player.email);
      const snap = await getDoc(playerDoc);
      if (!snap.exists()) {
        await setDoc(playerDoc, {
          id: player.email,
          name: player.name,
          email: player.email,
          avatar: player.avatar,
          predictions: simulateFullTournament(player.biasTeam, 35 - player.luck),
          isMock: true,
          scoreBreakdown: { groups: 0, bestThirds: 0, knockout: 0, total: 0 },
          hasSubmittedOfficial: true,
          submittedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        });
      }
    });
  }, []);

  // Recalculate leaderboard scores when officialResults or leaderboard entries change
  const scoredLeaderboard = leaderboard
    .filter(player => !ADMIN_EMAILS.includes(player.email))
    .map(player => {
      const scoreBreakdown = calculateScore(player.predictions, officialResults);
    
    // Get predicted champion details
    const champId = player.predictions.knockout[104];
    const champTeam = champId ? getTeamById(champId) : null;
    
    // Check if the prediction is correct
    const isChampCorrect = champId && officialResults.knockout[104] === champId;

    return {
      ...player,
      scoreBreakdown,
      champTeam,
      isChampCorrect
    };
  }).sort((a, b) => {
    // Sort by net community votes, then alphabetically
    const scoreA = (a.upvoters?.length || 0) - (a.downvoters?.length || 0);
    const scoreB = (b.upvoters?.length || 0) - (b.downvoters?.length || 0);
    
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return a.name.localeCompare(b.name);
  });

  // ==========================================
  // 4. ACTION HANDLERS
  // ==========================================

  // Shift team position in Group predictions
  const moveTeamInGroup = (groupKey, teamId, direction, isAdmin = false) => {
    if (!isAdmin && hasSubmitted) {
      addToast("Your bracket is permanently locked!", "error");
      return;
    }
    const currentData = isAdmin ? officialResults : userPredictions;
    const setter = isAdmin ? setOfficialResults : setUserPredictions;
    
    const groupList = [...currentData.groups[groupKey]];
    const index = groupList.indexOf(teamId);
    if (index === -1) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= groupList.length) return;
    
    // Swap positions
    const temp = groupList[index];
    groupList[index] = groupList[targetIndex];
    groupList[targetIndex] = temp;
    
    const nextPreds = {
      ...currentData,
      groups: {
        ...currentData.groups,
        [groupKey]: groupList
      }
    };
    
    const sanitized = sanitizePredictions(nextPreds);
    setter(sanitized);
    if (isAdmin) {
      setDoc(doc(db, 'admin', 'officialResults'), { data: sanitized });
    }
  };

  // Toggle third place wildcard team selection
  const toggleBestThirdTeam = (teamId, isAdmin = false) => {
    if (!isAdmin && hasSubmitted) {
      addToast("Your bracket is permanently locked!", "error");
      return;
    }
    const currentData = isAdmin ? officialResults : userPredictions;
    const setter = isAdmin ? setOfficialResults : setUserPredictions;
    
    const thirds = [...currentData.bestThirds];
    const index = thirds.indexOf(teamId);
    
    if (index >= 0) {
      // Remove it
      thirds.splice(index, 1);
    } else {
      // Add it, cap at 8
      if (thirds.length >= 8) {
        addToast("You can only select exactly 8 third-place teams!", "error");
        return;
      }
      thirds.push(teamId);
    }

    // Sort thirds based on original group letters to match bracket deterministic slots
    thirds.sort((a, b) => {
      let gA = '';
      let gB = '';
      for (const gKey in GROUPS) {
        if (GROUPS[gKey].teams.some(t => t.id === a)) gA = gKey;
        if (GROUPS[gKey].teams.some(t => t.id === b)) gB = gKey;
      }
      return gA.localeCompare(gB);
    });
    
    const nextPreds = {
      ...currentData,
      bestThirds: thirds
    };

    const sanitized = sanitizePredictions(nextPreds);
    setter(sanitized);
    if (isAdmin) {
      setDoc(doc(db, 'admin', 'officialResults'), { data: sanitized });
    }
  };

  // Pick winner in a knockout match
  const selectKnockoutWinner = (matchId, winnerId, isAdmin = false) => {
    if (!isAdmin && hasSubmitted) {
      addToast("Your bracket is permanently locked!", "error");
      return;
    }
    const currentData = isAdmin ? officialResults : userPredictions;
    const setter = isAdmin ? setOfficialResults : setUserPredictions;

    const nextPreds = {
      ...currentData,
      knockout: {
        ...currentData.knockout,
        [matchId]: winnerId
      }
    };

    const sanitized = sanitizePredictions(nextPreds);
    setter(sanitized);
    if (isAdmin) {
      setDoc(doc(db, 'admin', 'officialResults'), { data: sanitized });
    }
  };

  // Authentication Flows
  const closeAuthModal = () => {
    setAuthModal(null);
    setSimulatedLoading(false);
    setSimulatedAccountInput('');
    setSimulatedEmailInput('');
    setSimulatedPasswordInput('');
  };

  const handleAuthSelection = (provider) => {
    setAuthModal(provider);
  };

  const handleGoogleLogin = async () => {
    setSimulatedLoading(true);
    try {
      await signInWithGoogle();
      setAuthModal(null);
      addToast("Successfully logged in with Google!");
    } catch (e) {
      console.error("Firebase Google Auth Error:", e);
      addToast(`Failed to login: ${e.message}`, "error");
    } finally {
      setSimulatedLoading(false);
    }
  };

  const handleSimulatedLogin = (name, email) => {
    addToast("Email/Password auth is mocked! Use Google Sign-in.", "error");
  };

  const handleSignOut = async () => {
    await logout();
    addToast("Logged out successfully");
  };

  // Admin Fast Actions
  const runAdminSimulation = async () => {
    const sim = simulateFullTournament();
    await setDoc(doc(db, 'admin', 'officialResults'), { data: sim });
    addToast("FIFA World Cup simulated! Official results updated.");
  };

  const copyUserToOfficial = async () => {
    await setDoc(doc(db, 'admin', 'officialResults'), { data: userPredictions });
    addToast("Copied your current predictions to the official results.");
  };

  const resetOfficial = async () => {
    await setDoc(doc(db, 'admin', 'officialResults'), { data: createInitialPredictions() });
    addToast("Official results reset to in-progress.");
  };

  const triggerSubmitConfirm = () => {
    if (!currentUser) {
      setAuthModal('chooser');
      return;
    }
    setShowSubmitConfirm(true);
  };

  const executeSavePredictions = async () => {
    setShowSubmitConfirm(false);
    const timestamp = new Date().toISOString();
    await setDoc(doc(db, 'users', currentUser.email), {
      id: currentUser.email,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
      predictions: userPredictions,
      isMock: false,
      hasSubmittedOfficial: true,
      submittedAt: timestamp
    }, { merge: true });
    setHasSubmitted(true);
    addToast("Predictions saved securely and locked in!");
    setActiveTab('leaderboard');
  };

  const handleVote = async (targetEmail, voteType) => {
    if (!currentUser) {
      addToast("Please sign in to vote!", "error");
      return;
    }
    if (currentUser.email === targetEmail) {
      addToast("You cannot vote on your own bracket!", "error");
      return;
    }

    try {
      const targetDoc = doc(db, 'users', targetEmail);
      const snap = await getDoc(targetDoc);
      if (!snap.exists()) return;
      
      let data = snap.data();
      let upvoters = data.upvoters || [];
      let downvoters = data.downvoters || [];

      const wasUpvoted = upvoters.includes(currentUser.email);
      const wasDownvoted = downvoters.includes(currentUser.email);

      upvoters = upvoters.filter(email => email !== currentUser.email);
      downvoters = downvoters.filter(email => email !== currentUser.email);

      if (voteType === 'up' && !wasUpvoted) {
        upvoters.push(currentUser.email);
      } else if (voteType === 'down' && !wasDownvoted) {
        downvoters.push(currentUser.email);
      }

      await updateDoc(targetDoc, { upvoters, downvoters });
    } catch (e) {
      addToast("Failed to register vote.", "error");
    }
  };

  // ==========================================
  // 5. VIEW SUB-COMPONENTS
  // ==========================================

  // Extract the list of 3rd place teams from predictions
  const getThirdPlaceTeams = (data) => {
    const list = [];
    for (const groupKey in GROUPS) {
      const standings = data.groups[groupKey];
      if (standings && standings.length >= 3) {
        const teamId = standings[2];
        const team = getTeamById(teamId);
        if (team) {
          list.push({ ...team, groupKey });
        }
      }
    }
    return list;
  };

  return (
    <>
      {/* Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Main Header and Navigation */}
      <header className="app-header">
        <div className="logo-section">
          <Trophy className="logo-icon" size={32} />
          <div className="logo-text">
            <span>WORLD CUP 2026</span>
            <span className="logo-subtitle">Predictor Hub</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'predict' ? 'active' : ''}`}
            onClick={() => setActiveTab('predict')}
          >
            <Trophy size={16} /> Predictor
          </button>
          <button 
            className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Users size={16} /> Community
          </button>
          {isUserAdmin && (
            <button 
              className={`tab-btn admin-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <Settings size={16} /> Admin Panel
            </button>
          )}
          <button 
            className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <HelpCircle size={16} /> Scoring Rules
          </button>
        </nav>

        <div className="user-profile-section">
          {currentUser ? (
            <div className="user-badge">
              <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
              <span className="user-name">{currentUser.name}</span>
              <button onClick={handleSignOut} className="signout-btn" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="signin-btn" onClick={() => setAuthModal('chooser')}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </header>

      <main className="page-container">
        {/* ==========================================
            TAB: PREDICTOR STEP-BY-STEP
            ========================================== */}
        {activeTab === 'predict' && (
          <div>
            {/* Hero Banner */}
            <div className="hero-banner">
              <div className="hero-year">2026</div>
              <h1 className="hero-title">FIFA WORLD CUP <span>PREDICTOR</span></h1>
              <p className="hero-subtitle">Predict the path to glory across North America. Build your bracket and compete on the global leaderboard.</p>
              <div className="hero-hosts">
                <span className="host-badge"><img src="https://flagcdn.com/24x18/ca.png" width="24" height="18" style={{display:"inline-block", verticalAlign:"middle", marginRight:"6px", borderRadius:"2px"}} /> Canada</span>
                <span className="host-badge"><img src="https://flagcdn.com/24x18/mx.png" width="24" height="18" style={{display:"inline-block", verticalAlign:"middle", marginRight:"6px", borderRadius:"2px"}} /> Mexico</span>
                <span className="host-badge"><img src="https://flagcdn.com/24x18/us.png" width="24" height="18" style={{display:"inline-block", verticalAlign:"middle", marginRight:"6px", borderRadius:"2px"}} /> USA</span>
              </div>
            </div>

            {/* Step Wizard Bar */}
            <div className="steps-container">
              <div className="steps-line">
                <div 
                  className="steps-line-progress" 
                  style={{ width: `${predictorStep * 50}%` }}
                ></div>
              </div>
              
              <div 
                className={`step-item ${predictorStep === 0 ? 'active' : ''} ${predictorStep > 0 ? 'completed' : ''}`}
                onClick={() => setPredictorStep(0)}
              >
                <div className="step-bubble">1</div>
                <span className="step-label">Group Tables</span>
              </div>
              
              <div 
                className={`step-item ${predictorStep === 1 ? 'active' : ''} ${predictorStep > 1 ? 'completed' : ''}`}
                onClick={() => setPredictorStep(1)}
              >
                <div className="step-bubble">2</div>
                <span className="step-label">Best 3rd Teams</span>
              </div>
              
              <div 
                className={`step-item ${predictorStep === 2 ? 'active' : ''} ${predictorStep > 2 ? 'completed' : ''}`}
                onClick={() => setPredictorStep(2)}
              >
                <div className="step-bubble">3</div>
                <span className="step-label">Knockout Bracket</span>
              </div>
            </div>

            {/* Step 1: Groups Standings */}
            {predictorStep === 0 && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2>Predict Group Stage Standings</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Use Up/Down arrows to rank the teams in each group. The top 2 (Green) and the best 3rd places will advance.</p>
                </div>
                
                <div className="groups-grid">
                  {Object.keys(GROUPS).map(groupKey => {
                    const group = GROUPS[groupKey];
                    const predictedStandings = userPredictions.groups[groupKey] || [];
                    
                    return (
                      <div key={groupKey} className="group-card">
                        <div className="group-card-header">
                          <h3 className="group-title">{group.name}</h3>
                          <span className="group-badge">FIFA World Cup</span>
                        </div>
                        <table className="group-table">
                          <thead>
                            <tr className="table-header-row">
                              <th className="table-header-cell center-cell" style={{ width: '40px' }}>Pos</th>
                              <th className="table-header-cell">Team</th>
                              <th className="table-header-cell center-cell" style={{ width: '60px' }}>Rank</th>
                            </tr>
                          </thead>
                          <tbody>
                            {predictedStandings.map((teamId, index) => {
                              const team = getTeamById(teamId);
                              const pos = index + 1;
                              if (!team) return null;
                              
                              return (
                                <tr key={teamId} className={`team-row pos-${pos}`}>
                                  {/* pos-indicator handled via CSS border-left on .team-row */}
                                  <td className="table-cell center-cell">
                                    <span className="team-position-badge">{pos}</span>
                                  </td>
                                  <td className="table-cell">
                                    <div className="team-info">
                                      <TeamFlag team={team} />
                                      <span className="team-name">{team.name}</span>
                                    </div>
                                  </td>
                                  <td className="table-cell center-cell">
                                    <div className="row-actions">
                                      <button 
                                        className="row-action-btn"
                                        disabled={index === 0}
                                        onClick={() => moveTeamInGroup(groupKey, teamId, 'up')}
                                        title="Move Up"
                                      >
                                        <ArrowUp size={14} />
                                      </button>
                                      <button 
                                        className="row-action-btn"
                                        disabled={index === 3}
                                        onClick={() => moveTeamInGroup(groupKey, teamId, 'down')}
                                        title="Move Down"
                                      >
                                        <ArrowDown size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>

                <div className="wizard-footer">
                  <div></div>
                  <button className="btn-primary" onClick={() => setPredictorStep(1)}>
                    Next: Best 3rd Place Teams <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Wildcard 3rd-Place Teams */}
            {predictorStep === 1 && (
              <div>
                <div className="thirds-selection-container">
                  <div className="thirds-header">
                    <h2>Select 8 Best 3rd-Place Teams</h2>
                    <p className="thirds-subtitle">
                      Under the new 48-team format, the 8 third-place teams with the best records enter the Round of 32. Select the 8 teams you predict will advance.
                    </p>
                    
                    <span className={`counter-badge ${userPredictions.bestThirds.length === 8 ? 'completed' : ''}`}>
                      {userPredictions.bestThirds.length} / 8 Selected
                    </span>
                  </div>

                  <div className="thirds-grid">
                    {getThirdPlaceTeams(userPredictions).map(team => {
                      const isSelected = userPredictions.bestThirds.includes(team.id);
                      return (
                        <div 
                          key={team.id}
                          className={`third-team-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleBestThirdTeam(team.id)}
                        >
                          <div className="third-team-details">
                            <span className="third-team-group-badge">Group {team.groupKey}</span>
                            <TeamFlag team={team} />
                            <span className="team-name" style={{ maxWidth: '100px' }}>{team.name}</span>
                          </div>
                          
                          <div className="checkbox-circle">
                            ✓
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="wizard-footer">
                  <button className="btn-secondary" onClick={() => setPredictorStep(0)}>
                    <ChevronLeft size={16} /> Back to Groups
                  </button>
                  <button 
                    className="btn-primary" 
                    disabled={userPredictions.bestThirds.length !== 8}
                    onClick={() => setPredictorStep(2)}
                  >
                    Next: Knockout Bracket <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Bracket Play-offs */}
            {predictorStep === 2 && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2>Predict Knockout Bracket Winner</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Click on a team to predict them as the winner and advance them to the next round.</p>
                </div>

                {/* Bracket Tabs */}
                <div className="bracket-navigation">
                  <button 
                    className={`bracket-nav-btn ${activeBracketRound === 'R32' ? 'active' : ''}`}
                    onClick={() => setActiveBracketRound('R32')}
                  >
                    Round of 32 (16 Matches)
                  </button>
                  <button 
                    className={`bracket-nav-btn ${activeBracketRound === 'R16' ? 'active' : ''}`}
                    onClick={() => setActiveBracketRound('R16')}
                  >
                    Round of 16 (8 Matches)
                  </button>
                  <button 
                    className={`bracket-nav-btn ${activeBracketRound === 'QF' ? 'active' : ''}`}
                    onClick={() => setActiveBracketRound('QF')}
                  >
                    Quarterfinals (4 Matches)
                  </button>
                  <button 
                    className={`bracket-nav-btn ${activeBracketRound === 'SF' ? 'active' : ''}`}
                    onClick={() => setActiveBracketRound('SF')}
                  >
                    Semifinals (2 Matches)
                  </button>
                  <button 
                    className={`bracket-nav-btn ${activeBracketRound === 'FIN' ? 'active' : ''}`}
                    onClick={() => setActiveBracketRound('FIN')}
                  >
                    Finals & 3rd Place
                  </button>
                </div>

                {/* Matches List */}
                <div className="matches-grid">
                  {Object.values(KNOCKOUT_MATCHES)
                    .filter(m => {
                      if (activeBracketRound === 'R32') return m.round === 'R32';
                      if (activeBracketRound === 'R16') return m.round === 'R16';
                      if (activeBracketRound === 'QF') return m.round === 'QF';
                      if (activeBracketRound === 'SF') return m.round === 'SF';
                      return m.round === '3RD' || m.round === 'FI';
                    })
                    .map(match => {
                      const { teamA, teamB } = resolveTeamsForMatch(match.id, userPredictions);
                      const currentWinnerId = userPredictions.knockout[match.id];

                      const isChampionMatch = match.round === 'FI';

                      return (
                        <div key={match.id} className={`match-card ${isChampionMatch ? 'champion-card' : ''}`}>
                          <div className="match-card-header">
                            <span className="match-number">{match.title}</span>
                            <span className="match-venue">
                              {match.round === '3RD' ? 'Play-off' : match.round === 'FI' ? 'Championship' : 'Knockout Stage'}
                            </span>
                          </div>

                          <div className="match-teams">
                            {/* Team A */}
                            <div 
                              className={`match-team-row 
                                ${currentWinnerId && teamA && currentWinnerId === teamA.id ? 'selected' : ''} 
                                ${currentWinnerId && teamA && currentWinnerId !== teamA.id ? 'loser' : ''}
                              `}
                              onClick={() => teamA && selectKnockoutWinner(match.id, teamA.id)}
                            >
                              <div className="match-team-left">
                                <span className="match-team-source">{match.teamA_src}</span>
                                {teamA ? (
                                  <>
                                    <TeamFlag team={teamA} />
                                    <span className="match-team-name">{teamA.name}</span>
                                  </>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TBD</span>
                                )}
                              </div>
                              {currentWinnerId && teamA && currentWinnerId === teamA.id && (
                                <div className="winner-icon">✓</div>
                              )}
                            </div>

                            {/* VS Divider */}
                            <div className="vs-divider"><span className="vs-text">VS</span></div>

                            {/* Team B */}
                            <div 
                              className={`match-team-row 
                                ${currentWinnerId && teamB && currentWinnerId === teamB.id ? 'selected' : ''} 
                                ${currentWinnerId && teamB && currentWinnerId !== teamB.id ? 'loser' : ''}
                              `}
                              onClick={() => teamB && selectKnockoutWinner(match.id, teamB.id)}
                            >
                              <div className="match-team-left">
                                <span className="match-team-source">{match.teamB_src}</span>
                                {teamB ? (
                                  <>
                                    <TeamFlag team={teamB} />
                                    <span className="match-team-name">{teamB.name}</span>
                                  </>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TBD</span>
                                )}
                              </div>
                              {currentWinnerId && teamB && currentWinnerId === teamB.id && (
                                <div className="winner-icon">✓</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="wizard-footer">
                  <button className="btn-secondary" onClick={() => setPredictorStep(1)}>
                    <ChevronLeft size={16} /> Back to Wildcards
                  </button>

                  {isPredictionComplete(userPredictions) ? (
                    currentUser ? (
                      hasSubmitted ? (
                        <button className="btn-gold" style={{ filter: 'grayscale(1)', cursor: 'not-allowed', opacity: 0.7 }}>
                          <Sparkles size={16} /> Bracket Locked 🔒
                        </button>
                      ) : (
                        <button 
                          className="btn-gold" 
                          onClick={triggerSubmitConfirm}
                        >
                          <Sparkles size={16} /> Save & Submit Predictions
                        </button>
                      )
                    ) : (
                      <button className="btn-gold" onClick={() => setAuthModal('chooser')}>
                        <LogIn size={16} /> Sign In to Save & Join Leaderboard
                      </button>
                    )
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={16} style={{ color: 'var(--accent-gold)' }} />
                      <span>Finish predicting all knockout winners to submit!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB: LEADERBOARD
            ========================================== */}
        {activeTab === 'leaderboard' && (
          <div className="leaderboard-container">
            <div className="leaderboard-header">
              <div className="leaderboard-title-box">
                <h2>Community Predictions</h2>
                <p>Browse what everyone else is predicting. Click on a player to view their full bracket.</p>
              </div>

              <div className="counter-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-gold)', color: '#000', fontWeight: 'bold' }}>
                <Sparkles size={16} /> 
                Leaderboard rankings and points will be unlocked after the real-world Group Stage is completed!
              </div>
            </div>

            <div className="leaderboard-table-card">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th className="leaderboard-th">Player</th>
                    <th className="leaderboard-th">Predicted Champion</th>
                    <th className="leaderboard-th center">Community Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {scoredLeaderboard.map((player) => {
                    const isSelf = currentUser && player.email === currentUser.email;
                    return (
                      <tr 
                        key={player.id} 
                        className={`leaderboard-tr ${isSelf ? 'current-user' : ''}`}
                        onClick={() => setViewingUserDetail(player)}
                      >
                        <td className="leaderboard-td">
                          <div className="player-cell-info">
                            <img src={player.avatar} alt={player.name} className="player-avatar" />
                            <div>
                              <span className="player-name-text">{player.name}</span>
                              {isSelf && <span className="user-tag">You</span>}
                              {player.submittedAt && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Clock size={10} />
                                  <span>{new Date(player.submittedAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="leaderboard-td">
                          {player.champTeam ? (
                            <span className={`champion-predicted-badge ${player.isChampCorrect ? 'winner-correct' : ''}`}>
                              <TeamFlag team={player.champTeam} />
                              <span>{player.champTeam.name}</span>
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                          )}
                        </td>
                        <td className="leaderboard-td center">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 'bold' }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleVote(player.email, 'up'); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: player.upvoters?.includes(currentUser?.email) ? 'var(--accent-green)' : 'var(--text-muted)' }}
                            >
                              <ArrowBigUp size={24} fill={player.upvoters?.includes(currentUser?.email) ? 'var(--accent-green)' : 'none'} />
                            </button>
                            <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '1rem', color: ((player.upvoters?.length || 0) - (player.downvoters?.length || 0)) > 0 ? 'var(--accent-green)' : ((player.upvoters?.length || 0) - (player.downvoters?.length || 0)) < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                              {((player.upvoters?.length || 0) - (player.downvoters?.length || 0)) > 0 ? `+${(player.upvoters?.length || 0) - (player.downvoters?.length || 0)}` : ((player.upvoters?.length || 0) - (player.downvoters?.length || 0))}
                            </span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleVote(player.email, 'down'); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: player.downvoters?.includes(currentUser?.email) ? 'var(--accent-red)' : 'var(--text-muted)' }}
                            >
                              <ArrowBigDown size={24} fill={player.downvoters?.includes(currentUser?.email) ? 'var(--accent-red)' : 'none'} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: ADMIN PANEL
            ========================================== */}
        {activeTab === 'admin' && (
          <div>
            <div className="admin-card">
              <div className="admin-header">
                <Settings size={24} />
                <h2>Tournament Admin Control Room</h2>
              </div>
              <p className="admin-desc">
                Since the actual World Cup has not concluded yet, you can use these tools to simulate full tournament results, copy your predictions as official, or manually pick outcomes to watch the leaderboard recalculate in real-time!
              </p>
              
              <div className="admin-actions-grid">
                <button className="admin-btn" onClick={runAdminSimulation}>
                  <Play size={24} style={{ color: 'var(--accent-green)' }} />
                  <span className="admin-btn-title">Simulate Tournament</span>
                  <span className="admin-btn-subtitle">Generate random ratings-based results for all stages</span>
                </button>

                <button className="admin-btn" onClick={copyUserToOfficial}>
                  <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
                  <span className="admin-btn-title">Copy My Predictions</span>
                  <span className="admin-btn-subtitle">Set official results to match your brackets (100% score)</span>
                </button>

                <button className="admin-btn" onClick={resetOfficial}>
                  <RefreshCw size={24} style={{ color: 'var(--accent-blue)' }} />
                  <span className="admin-btn-title">Reset Official Results</span>
                  <span className="admin-btn-subtitle">Clear all simulated tournament results</span>
                </button>
              </div>
            </div>

            {/* Manual Admin Override Editor */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2>Manual Override Official Standings</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Override exact group orders and click knockout winners to manually dictate tournament outcomes.</p>
            </div>

            <div className="groups-grid" style={{ marginBottom: '3rem' }}>
              {Object.keys(GROUPS).map(groupKey => {
                const group = GROUPS[groupKey];
                const officialStandings = officialResults.groups[groupKey] || [];
                
                return (
                  <div key={groupKey} className="group-card" style={{ border: '1px solid rgba(251,191,36,0.15)' }}>
                    <div className="group-card-header" style={{ backgroundColor: 'rgba(251,191,36,0.05)' }}>
                      <h3 className="group-title" style={{ color: 'var(--accent-gold)' }}>{group.name} (Official)</h3>
                    </div>
                    <table className="group-table">
                      <tbody>
                        {officialStandings.map((teamId, index) => {
                          const team = getTeamById(teamId);
                          const pos = index + 1;
                          if (!team) return null;
                          
                          return (
                            <tr key={teamId} className={`team-row pos-${pos}`}>
                              {/* pos-indicator handled via CSS border-left on .team-row */}
                              <td className="table-cell center-cell">
                                <span className="team-position-badge">{pos}</span>
                              </td>
                              <td className="table-cell">
                                <div className="team-info">
                                  <TeamFlag team={team} />
                                  <span className="team-name">{team.name}</span>
                                </div>
                              </td>
                              <td className="table-cell center-cell">
                                <div className="row-actions">
                                  <button 
                                    className="row-action-btn"
                                    disabled={index === 0}
                                    onClick={() => moveTeamInGroup(groupKey, teamId, 'up', true)}
                                  >
                                    <ArrowUp size={14} />
                                  </button>
                                  <button 
                                    className="row-action-btn"
                                    disabled={index === 3}
                                    onClick={() => moveTeamInGroup(groupKey, teamId, 'down', true)}
                                  >
                                    <ArrowDown size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            <div className="thirds-selection-container" style={{ border: '1px solid rgba(251,191,36,0.15)', marginBottom: '3rem' }}>
              <div className="thirds-header">
                <h2 style={{ color: 'var(--accent-gold)' }}>Official 8 Best 3rd-Place Teams</h2>
                <span className={`counter-badge ${officialResults.bestThirds.length === 8 ? 'completed' : ''}`}>
                  {officialResults.bestThirds.length} / 8 Selected
                </span>
              </div>
              <div className="thirds-grid">
                {getThirdPlaceTeams(officialResults).map(team => {
                  const isSelected = officialResults.bestThirds.includes(team.id);
                  return (
                    <div 
                      key={team.id}
                      className={`third-team-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleBestThirdTeam(team.id, true)}
                    >
                      <div className="third-team-details">
                        <span className="third-team-group-badge">Group {team.groupKey}</span>
                        <TeamFlag team={team} />
                        <span className="team-name" style={{ maxWidth: '100px' }}>{team.name}</span>
                      </div>
                      <div className="checkbox-circle">✓</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bracket-navigation" style={{ border: '1px solid rgba(251,191,36,0.15)' }}>
              {['R32', 'R16', 'QF', 'SF', 'FIN'].map(round => (
                <button 
                  key={round}
                  className={`bracket-nav-btn ${adminBracketRound === round ? 'active' : ''}`}
                  onClick={() => setAdminBracketRound(round)}
                >
                  {round === 'R32' && "Round of 32"}
                  {round === 'R16' && "Round of 16"}
                  {round === 'QF' && "Quarterfinals"}
                  {round === 'SF' && "Semifinals"}
                  {round === 'FIN' && "Finals"}
                </button>
              ))}
            </div>

            <div className="matches-grid">
              {Object.values(KNOCKOUT_MATCHES)
                .filter(m => {
                  if (adminBracketRound === 'R32') return m.round === 'R32';
                  if (adminBracketRound === 'R16') return m.round === 'R16';
                  if (adminBracketRound === 'QF') return m.round === 'QF';
                  if (adminBracketRound === 'SF') return m.round === 'SF';
                  return m.round === '3RD' || m.round === 'FI';
                })
                .map(match => {
                  const { teamA, teamB } = resolveTeamsForMatch(match.id, officialResults);
                  const currentWinnerId = officialResults.knockout[match.id];

                  const isChampionMatch = match.round === 'FI';

                  return (
                    <div key={match.id} className={`match-card ${isChampionMatch ? 'champion-card' : ''}`} style={{ border: '1px solid rgba(251,191,36,0.15)' }}>
                      <div className="match-card-header">
                        <span className="match-number" style={{ backgroundColor: 'var(--accent-gold-bg)', color: 'var(--accent-gold)' }}>{match.title}</span>
                      </div>

                      <div className="match-teams">
                        <div 
                          className={`match-team-row 
                            ${currentWinnerId && teamA && currentWinnerId === teamA.id ? 'selected' : ''} 
                            ${currentWinnerId && teamA && currentWinnerId !== teamA.id ? 'loser' : ''}
                          `}
                          onClick={() => teamA && selectKnockoutWinner(match.id, teamA.id, true)}
                        >
                          <div className="match-team-left">
                            <span className="match-team-source">{match.teamA_src}</span>
                            {teamA ? (
                              <>
                                <TeamFlag team={teamA} />
                                <span className="match-team-name">{teamA.name}</span>
                              </>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TBD</span>
                            )}
                          </div>
                        </div>

                        {/* VS Divider */}
                        <div className="vs-divider"><span className="vs-text">VS</span></div>

                        <div 
                          className={`match-team-row 
                            ${currentWinnerId && teamB && currentWinnerId === teamB.id ? 'selected' : ''} 
                            ${currentWinnerId && teamB && currentWinnerId !== teamB.id ? 'loser' : ''}
                          `}
                          onClick={() => teamB && selectKnockoutWinner(match.id, teamB.id, true)}
                        >
                          <div className="match-team-left">
                            <span className="match-team-source">{match.teamB_src}</span>
                            {teamB ? (
                              <>
                                <TeamFlag team={teamB} />
                                <span className="match-team-name">{teamB.name}</span>
                              </>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TBD</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB: RULES & SYSTEM INFO
            ========================================== */}
        {activeTab === 'rules' && (
          <div className="rules-grid">
            <div className="rules-card">
              <h3>Group Stage Points</h3>
              <div className="rules-list">
                <div className="rules-item">
                  <span className="rules-points-badge">+2 Pts</span>
                  <div className="rules-item-text">
                    <h4>Exact Position Standing</h4>
                    <p>Awarded for predicting a team to finish in the exact correct position (e.g. Group A winner finishes Group A winner).</p>
                  </div>
                </div>

                <div className="rules-item">
                  <span className="rules-points-badge">+1 Pt</span>
                  <div className="rules-item-text">
                    <h4>Qualification Correct (Wrong Position)</h4>
                    <p>Awarded for predicting a team to qualify to the Round of 32, but they finished in a different qualifying spot.</p>
                  </div>
                </div>

                <div className="rules-item">
                  <span className="rules-points-badge">+2 Pts</span>
                  <div className="rules-item-text">
                    <h4>Best 3rd Place Wildcards</h4>
                    <p>Awarded for predicting a 3rd-place team that successfully wildcard-qualifies to the Round of 32.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rules-card">
              <h3>Knockout Phase Points</h3>
              <div className="rules-list">
                <div className="rules-item">
                  <span className="rules-points-badge">Match Pts</span>
                  <div className="rules-item-text">
                    <h4>Correct Winners per Round</h4>
                    <p>Predicting the correct winner of the match awards:</p>
                    <ul style={{ listStyle: 'none', paddingLeft: '0.5rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <li>• Round of 32: <strong>+5 Pts</strong></li>
                      <li>• Round of 16: <strong>+8 Pts</strong></li>
                      <li>• Quarterfinals: <strong>+12 Pts</strong></li>
                      <li>• Semifinals: <strong>+20 Pts</strong></li>
                      <li>• 3rd Place Match: <strong>+15 Pts</strong></li>
                      <li>• Final (Champion): <strong>+30 Pts</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="rules-item">
                  <span className="rules-points-badge">Bracket Bonus</span>
                  <div className="rules-item-text">
                    <h4>Correct Bracket Participants</h4>
                    <p>Predicting a team to participate in a knockout match, even if they lose:</p>
                    <ul style={{ listStyle: 'none', paddingLeft: '0.5rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <li>• Round of 32: <strong>+2 Pts per team</strong></li>
                      <li>• Round of 16: <strong>+3 Pts per team</strong></li>
                      <li>• Quarterfinals: <strong>+4 Pts per team</strong></li>
                      <li>• Semifinals: <strong>+6 Pts per team</strong></li>
                      <li>• Finalists (Match 104): <strong>+10 Pts per team</strong></li>
                      <li>• Correct Runner-up (Final Loser): <strong>+20 Pts</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer page-container" style={{ marginTop: 0 }}>
        <div className="footer-left">
          <Trophy className="footer-logo" size={20} />
          <span>FIFA World Cup 2026™ Predictor &copy; 2026</span>
        </div>
        <div className="footer-right">
          <div className="footer-stat">
            <Users size={14} /> <strong>{leaderboard.length}</strong> Players
          </div>
          <div className="footer-stat">
            <Sparkles size={14} /> <strong>48</strong> Teams
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL: USER AUTH CHOOSER & SIMULATORS
          ========================================== */}
      {authModal && (
        <div className="modal-overlay">
          {/* 1. Provider Chooser Screen */}
          {authModal === 'chooser' && (
            <div className="modal-content" style={{ maxWidth: '400px' }}>
              <button className="modal-close-btn" onClick={closeAuthModal}>×</button>
              <div className="modal-body auth-chooser-container">
                <Trophy size={48} style={{ color: 'var(--accent-gold)', alignSelf: 'center' }} />
                <h3 className="auth-title">Predictor Login</h3>
                <p className="auth-subtitle">Sign in to save your brackets and unlock live leaderboard scores.</p>
                
                <div className="auth-buttons-list">
                  <button className="auth-social-btn google-btn" onClick={handleGoogleLogin}>
                    <div className="auth-btn-icon">
                      {/* Google Logo SVG */}
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <span>Continue with Google</span>
                  </button>

                  <button className="auth-social-btn auth0-btn" onClick={() => handleAuthSelection('auth0')}>
                    <div className="auth-btn-icon">
                      {/* Auth0 Logo SVG */}
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M21.96 11.23c0-1.87-.74-3.6-2.06-4.88L24 2.8c-1.32-.97-3.01-1.57-4.88-1.57-4.32 0-7.86 3.54-7.86 7.86 0 .5.05.98.14 1.45L4.47 5.92c.62-1.34.96-2.83.96-4.4C5.43.68 4.75 0 3.9 0 3.05 0 2.37.68 2.37 1.52c0 2.76 1.05 5.27 2.76 7.15L0 13.25c1.32.97 3.01 1.57 4.88 1.57 3.23 0 5.99-1.97 7.14-4.76l6.93 4.63c-.61 1.34-.95 2.82-.95 4.39 0 .84.68 1.52 1.52 1.52.84 0 1.52-.68 1.52-1.52 0-2.76-1.05-5.27-2.76-7.15l5.13-4.58c.31.84.49 1.76.49 2.72v.16zm-12.8 1.48c-1.36 0-2.47-1.11-2.47-2.47s1.11-2.47 2.47-2.47 2.47 1.11 2.47 2.47-1.11 2.47-2.47 2.47z" />
                      </svg>
                    </div>
                    <span>Continue with Auth0</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Simulated Google Sign-In Popup */}
          {authModal === 'google' && (
            <div className="google-popup-card">
              <button 
                className="modal-close-btn" 
                style={{ color: '#5f6368', top: '1rem', right: '1rem' }} 
                onClick={closeAuthModal}
              >
                ×
              </button>
              
              <svg viewBox="0 0 24 24" width="75" height="28" className="google-logo-svg">
                <path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              
              {simulatedLoading ? (
                <div style={{ margin: '3rem 0' }}>
                  <div className="google-spinner"></div>
                  <p style={{ fontSize: '0.9rem', color: '#5f6368', marginTop: '1rem' }}>Connecting to accounts.google.com...</p>
                </div>
              ) : (
                <>
                  <h3 className="google-popup-title">Choose an account</h3>
                  <p className="google-popup-subtitle">to continue to World Cup Predictor</p>
                  
                  {/* Selectable pre-seeded profiles */}
                  <div style={{ width: '100%' }}>
                    <div 
                      className="google-account-item"
                      onClick={() => handleSimulatedLogin("Cristiano Ronaldo", "cr7.siuuu@alnassr.sa")}
                    >
                      <div className="google-account-avatar" style={{ backgroundColor: '#ff7043' }}>C</div>
                      <div className="google-account-details">
                        <span className="google-account-name">Cristiano Ronaldo</span>
                        <span className="google-account-email">cr7.siuuu@alnassr.sa</span>
                      </div>
                    </div>
                    
                    <div 
                      className="google-account-item"
                      onClick={() => handleSimulatedLogin("Lionel Messi", "leomessi10@intermiami.com")}
                    >
                      <div className="google-account-avatar" style={{ backgroundColor: '#66bb6a' }}>L</div>
                      <div className="google-account-details">
                        <span className="google-account-name">Lionel Messi</span>
                        <span className="google-account-email">leomessi10@intermiami.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="google-custom-login-form">
                    <p style={{ fontSize: '0.8rem', color: '#5f6368', textAlign: 'left', margin: '0.5rem 0' }}>Or sign in as guest:</p>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="google-input"
                      value={simulatedAccountInput}
                      onChange={(e) => setSimulatedAccountInput(e.target.value)}
                    />
                    <input 
                      type="email" 
                      placeholder="Your Google Email (name@gmail.com)" 
                      className="google-input"
                      value={simulatedEmailInput}
                      onChange={(e) => setSimulatedEmailInput(e.target.value)}
                    />
                    <button 
                      className="google-submit-btn"
                      onClick={() => handleSimulatedLogin(simulatedAccountInput, simulatedEmailInput)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 3. Simulated Auth0 Lock Popup */}
          {authModal === 'auth0' && (
            <div className="auth0-lock-card">
              <button 
                className="modal-close-btn" 
                style={{ top: '1rem', right: '1rem' }} 
                onClick={closeAuthModal}
              >
                ×
              </button>
              
              <div className="auth0-lock-header">
                <div className="auth0-lock-logo">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M21.96 11.23c0-1.87-.74-3.6-2.06-4.88L24 2.8c-1.32-.97-3.01-1.57-4.88-1.57-4.32 0-7.86 3.54-7.86 7.86 0 .5.05.98.14 1.45L4.47 5.92c.62-1.34.96-2.83.96-4.4C5.43.68 4.75 0 3.9 0 3.05 0 2.37.68 2.37 1.52c0 2.76 1.05 5.27 2.76 7.15L0 13.25c1.32.97 3.01 1.57 4.88 1.57 3.23 0 5.99-1.97 7.14-4.76l6.93 4.63c-.61 1.34-.95 2.82-.95 4.39 0 .84.68 1.52 1.52 1.52.84 0 1.52-.68 1.52-1.52 0-2.76-1.05-5.27-2.76-7.15l5.13-4.58c.31.84.49 1.76.49 2.72v.16zm-12.8 1.48c-1.36 0-2.47-1.11-2.47-2.47s1.11-2.47 2.47-2.47 2.47 1.11 2.47 2.47-1.11 2.47-2.47 2.47z" />
                  </svg>
                </div>
                <h3 className="auth0-lock-title">World Cup Predictor</h3>
              </div>

              {simulatedLoading ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                  <div className="simulated-spinner"></div>
                  <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>Authenticating via Auth0 Lock...</p>
                </div>
              ) : (
                <div className="auth0-lock-body">
                  <div className="auth0-input-group">
                    <label className="auth0-label">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="yours@example.com" 
                      className="auth0-input"
                      value={simulatedEmailInput}
                      onChange={(e) => setSimulatedEmailInput(e.target.value)}
                    />
                  </div>

                  <div className="auth0-input-group">
                    <label className="auth0-label">Password</label>
                    <input 
                      type="password" 
                      placeholder="your password" 
                      className="auth0-input"
                      value={simulatedPasswordInput}
                      onChange={(e) => setSimulatedPasswordInput(e.target.value)}
                    />
                  </div>

                  <button 
                    className="auth0-submit-btn"
                    onClick={() => {
                      if (!simulatedEmailInput) {
                        addToast("Please provide an email address", "error");
                        return;
                      }
                      const name = simulatedEmailInput.split('@')[0];
                      handleSimulatedLogin(name, simulatedEmailInput);
                    }}
                  >
                    Log In
                  </button>
                  
                  <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>Powered by Auth0</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          MODAL: SUBMIT CONFIRMATION
          ========================================== */}
      {showSubmitConfirm && (
        <div className="modal-overlay" onClick={() => setShowSubmitConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '0', overflow: 'hidden' }}>
            
            {/* Header Area with Gold Accent */}
            <div style={{ backgroundColor: 'rgba(255, 215, 0, 0.08)', borderBottom: '1px solid rgba(255, 215, 0, 0.15)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={36} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Ready to submit?</h2>
            </div>

            {/* Body Area */}
            <div style={{ padding: '1.75rem 2rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', textAlign: 'center', margin: 0 }}>
                Awesome bracket! You're about to join the community leaderboard. 
                Just remember, once you submit, your bracket will be <strong style={{ color: 'var(--text-primary)' }}>officially locked in</strong> and you won't be able to make changes.
              </p>
            </div>

            {/* Footer / Buttons Area */}
            <div style={{ padding: '0 2rem 2rem 2rem', display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setShowSubmitConfirm(false)} 
                style={{ flex: 1, padding: '0.875rem', justifyContent: 'center', fontWeight: 'bold' }}
              >
                Keep Editing
              </button>
              <button 
                className="btn-gold" 
                onClick={executeSavePredictions} 
                style={{ flex: 1, padding: '0.875rem', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' }}
              >
                Let's Go!
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: VIEW USER PREDICTIONS COMPARED
          ========================================== */}
      {viewingUserDetail && (
        <div className="modal-overlay" onClick={() => setViewingUserDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
            <button className="modal-close-btn" onClick={() => setViewingUserDetail(null)}>×</button>
            
            <div className="modal-header">
              <div className="compare-header-info">
                <img src={viewingUserDetail.avatar} alt={viewingUserDetail.name} className="player-avatar" style={{ width: '48px', height: '48px' }} />
                <div>
                  <h3 className="compare-title">{viewingUserDetail.name}'s Predictions</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Points and ranking will be revealed soon!
                  </p>
                  {viewingUserDetail.submittedAt && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                      Submitted: {new Date(viewingUserDetail.submittedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-body compare-grid">
              {/* Group stages compare */}
              <div>
                <h4 className="compare-section-title">Group Standings Predictions</h4>
                <div className="compare-list-group">
                  {Object.keys(GROUPS).map(groupKey => {
                    const predList = viewingUserDetail.predictions.groups[groupKey] || [];
                    const offList = officialResults.groups[groupKey] || [];
                    
                    return (
                      <div key={groupKey} className="compare-group-item">
                        <span className="compare-group-name">Group {groupKey}</span>
                        <div className="compare-team-list">
                          {predList.map((teamId, idx) => {
                            const team = getTeamById(teamId);
                            if (!team) return null;
                            return (
                              <div key={teamId} className="compare-team-inline">
                                <span>{idx + 1}. <TeamFlag team={team} /> {team.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wildcard 3rds compare */}
              <div>
                <h4 className="compare-section-title">Wildcard 3rd-Place Qualifiers</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {viewingUserDetail.predictions.bestThirds.map(teamId => {
                    const team = getTeamById(teamId);
                    if (!team) return null;
                    return (
                      <span 
                        key={teamId}
                        className="champion-predicted-badge"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <TeamFlag team={team} /> {team.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Key Knockout Match predictions */}
              <div>
                <h4 className="compare-section-title">Knockout Stage Predictions</h4>
                <div className="compare-matches-list">
                  {Object.values(KNOCKOUT_MATCHES)
                    .filter(m => m.round === 'QF' || m.round === 'SF' || m.round === 'FI')
                    .map(match => {
                      const predWinnerId = viewingUserDetail.predictions.knockout[match.id];
                      const predWinner = getTeamById(predWinnerId);
                      
                      const offWinnerId = officialResults.knockout[match.id];
                      const isCorrect = predWinnerId && predWinnerId === offWinnerId;

                      return (
                        <div key={match.id} className="compare-match-item">
                          <span className="compare-match-title">
                            {match.round === 'FI' ? "Championship Final" : match.title}
                          </span>
                          <div className="compare-match-row-compare">
                            <span className="compare-label-type">Predicted Winner:</span>
                            {predWinner ? (
                              <span className="compare-value-team">
                                <TeamFlag team={predWinner} /> {predWinner.name}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>None</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
