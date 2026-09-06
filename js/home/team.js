import { renderTeamCard } from '../components/team-card.js';

export function initTeamSection() {
    const teamContainer = document.querySelector("#team-list");
    if (!teamContainer) return;

    const teamMembers = [
        { name: "Jane Cooper", role: "CEO", image: "../../assets/images/team/team1.png" },
        { name: "Jane Cooper", role: "CEO", image: "../../assets/images/team/team2.png" },
        { name: "Jane Cooper", role: "CEO", image: "../../assets/images/team/team3.png" },
        { name: "Jane Cooper", role: "CEO", image: "../../assets/images/team/team4.png" }
    ];

    teamContainer.innerHTML = teamMembers.map(renderTeamCard).join("");
}