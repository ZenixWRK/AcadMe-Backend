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
} // gets all assignments for a user

export async function createAssignment(req, res) {
    try {
            const { userId, title, description, dueDate, subject, priority } = req.body;
            if (!userId || !title || !description || !dueDate || !subject) {
                return res.status(400).json({ message: 'userId, title, description, dueDate, and subject are required' });
            }
    
            const assignment = await sql`
                INSERT INTO assignments (userId, title, description, dueDate, subject, priority, completed)
                VALUES (${userId}, ${title}, ${description}, ${dueDate}, ${subject}, ${priority || 'medium'}, ${false})   
                RETURNING *
                `
            
            console.log('Assignment created:', assignment[0]);
            res.status(201).json(assignment[0]); // return the created assignment
                
        } catch (err) {
            console.error('Error creating assignment:', err);
            res.status(500).json({ message: 'Error creating assignment' });
        }
} // creates a new assignment

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
} // deletes an assignment by id, if it can find it

export async function updateAssignment(req, res) {
    try {
        const { id } = req.params;
        const { title, description, dueDate, subject, priority, completed } = req.body;
        
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Assignment id is required/needs to be a number' });
        }

        const assignment = await sql`
            UPDATE assignments 
            SET title = ${title}, description = ${description}, dueDate = ${dueDate}, 
                subject = ${subject}, priority = ${priority}, completed = ${completed}
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
} // updates an assignment

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
} // toggles assignment completion status

export async function getAssignmentsBySubject(req, res) {
    try {
        const { userId, subject } = req.params;
        
        if (!userId || !subject) {
            return res.status(400).json({ message: 'userId and subject are required' });
        }

        const assignments = await sql`
            SELECT * FROM assignments 
            WHERE userid = ${userId} AND subject = ${subject} 
            ORDER BY dueDate ASC
        `;

        res.status(200).json(assignments);
    } catch (err) {
        console.error('Error fetching assignments by subject:', err);
        res.status(500).json({ message: 'Error fetching assignments by subject' });
    }
} // gets assignments filtered by subject