import { sql } from '../config/Database.js';

export async function getAssignmentsByUserId(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'userId query parameter is required' });
        };

        const assignments = await sql`
            SELECT * FROM assignments WHERE userid = ${userId} ORDER BY createdat DESC
        `;

        res.status(200).json(assignments);
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
}

export async function createAssignment(req, res) {
    try {
            const incoming = req.body || {};
            const userId = incoming.userId ?? incoming.userid ?? incoming.user_id;
            const title = incoming.title;
            const description = incoming.description;
            const dueDate = incoming.dueDate ?? incoming.duedate ?? incoming.due_date;
            const priority = incoming.priority ?? 'medium';

            const missing = [];
            if (!userId) missing.push('userId');
            if (!title) missing.push('title');
            if (!description) missing.push('description');
            if (!dueDate) missing.push('dueDate');

            if (missing.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
            }
    
            const assignment = await sql`
                INSERT INTO assignments (userid, title, description, duedate, priority, completed)
                VALUES (${userId}, ${title}, ${description}, ${dueDate}, ${priority}, ${false})   
                RETURNING *
                `
            
            console.log('Assignment created:', assignment[0]);
            res.status(201).json(assignment[0]); // return the created assignment
                
        } catch (err) {
            console.error('Error creating assignment:', err);
            res.status(500).json({ message: 'Error creating assignment' });
        }
}

export async function deleteAssignment(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Assignment id is required/needs to be a number' });
        }

        const result = await sql`
            DELETE FROM assignments WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (err) {
        console.error('Error deleting assignment:', err);
        res.status(500).json({ message: 'Error deleting assignment' });
    }
}

export async function updateAssignment(req, res) {
    try {
        const { id } = req.params;
        const incoming = req.body || {};
        const title = incoming.title;
        const description = incoming.description;
        const dueDate = incoming.dueDate ?? incoming.duedate ?? incoming.due_date;
        const priority = incoming.priority;
        const completed = incoming.completed;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Assignment id is required/needs to be a number' });
        }
        // ? using this so i can commit and pus
        const assignment = await sql`
            UPDATE assignments
            SET title = COALESCE(${title}, title),
                description = COALESCE(${description}, description),
                duedate = COALESCE(${dueDate}, duedate),
                priority = COALESCE(${priority}, priority),
                completed = COALESCE(${completed}, completed)
            WHERE id = ${id}
                RETURNING *
        `;

        if (assignment.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json(assignment[0]);
    } catch (err) {
        console.error('Error updating assignment:', err);
        res.status(500).json({ message: 'Error updating assignment' });
    }
}

export async function toggleAssignmentCompletion(req, res) {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Assignment id is required/needs to be a number' });
        }

        const assignment = await sql`
            UPDATE assignments 
            SET completed = NOT completed
            WHERE id = ${id} 
            RETURNING *
        `;

        if (assignment.length === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.status(200).json(assignment[0]);
    } catch (err) {
        console.error('Error toggling assignment completion:', err);
        res.status(500).json({ message: 'Error toggling assignment completion' });
    }
}

const suggestedFocus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { keywords } = req.body;

        const assignments = await Assignment.find({
            userId: userId,
            completed: false
        });

        if (assignments.length === 0) {
            return res.status(404).json({ message: 'No pending assignments found' });
        }

        const scoredAssignments = assignments.map(assignment => {
            let score = 0;

            const titleLower = assignment.title.toLowerCase();
            const descLower = (assignment.description || '').toLowerCase();

            keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                if (titleLower.includes(keywordLower)) score += 10;
                if (descLower.includes(keywordLower)) score += 5;
            });

            if (assignment.priority === 'high') score += 15;
            else if (assignment.priority === 'medium') score += 10;
            else if (assignment.priority === 'low') score += 5;

            const dueDate = new Date(assignment.dueDate);
            const now = new Date();
            const daysUntilDue = (dueDate - now) / (1000 * 60 * 60 * 24);

            if (daysUntilDue < 1) score += 20;
            else if (daysUntilDue < 3) score += 15;
            else if (daysUntilDue < 7) score += 10;
            else score += 5;

            return {
                assignment,
                score
            };
        });

        scoredAssignments.sort((a, b) => b.score - a.score);

        const keyFocus = scoredAssignments[0].assignment;

        res.json({
            keyFocus,
            score: scoredAssignments[0].score,
            totalAssignments: assignments.length,
        });

    } catch (error) {
        console.error('Error finding key focus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}