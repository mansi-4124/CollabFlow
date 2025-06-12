import styles from "./team-members-card.module.css";

interface Member {
  name: string;
  role: string;
  isOwner?: boolean;
  isLead?: boolean;
}

interface TeamMembersCardProps {
  members: Member[];
}

const TeamMembersCard: React.FC<TeamMembersCardProps> = ({ members }) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
        Team Members
      </h3>
      <ul className="list-none p-0 m-0">
        {members.map((member, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
          >
            <span className="font-medium text-base">{member.name}</span>
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              {member.isOwner && (
                <span
                  className={`${styles.roleTag} bg-primary text-primary-foreground`}
                >
                  Owner
                </span>
              )}
              {member.isLead && (
                <span
                  className={`${styles.roleTag} bg-secondary text-secondary-foreground`}
                >
                  Lead
                </span>
              )}
              {!member.isOwner && !member.isLead && (
                <span
                  className={`${styles.roleTag} bg-muted text-muted-foreground`}
                >
                  Member
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMembersCard;
