const db = require("../config/db-config");

exports.contentLike = async (req, res) => {
    try {
        const content = req.params.id;
        const userId = req.auth;
        const like = req.body.like;

        //j'attends la réponse de la promesse pour pouvoir ensuite savoir si l'utilisateur a déjà un like associé à ce contenu
        const hasLike = await new Promise((resolve, reject) => {
            db.query(
                `
                SELECT 
                    * 
                FROM likes 
                WHERE like_content_id  = ? AND like_user_id = ?`,
                [content, userId],
                (error, result) => {
                    if (error) return reject(new Error(error));
                    else {
                        resolve(result);
                    }
                }
            );
        });

        switch (like) {
            case 0:
                // l'Objet existe : L'utilisateur a déjà un like sur ce contenu
                if (hasLike[0]) {
                    db.query(`
                        DELETE 
                        FROM likes 
                        WHERE like_user_id =? AND like_content_id = ?`,
                        [userId, content],
                        (error, result) => {
                            if (error) throw error;
                            else {
                                return res.status(200).json({ message: "Like Supprimé" });
                            }
                        }
                    );
                } else {
                    return res.status(500).json({ message: "Action impossible" });
                }
                break;
            case 1:
                if (hasLike[0]) {
                    return res.status(500).json({ message: "Action impossible" });
                } else {
                    db.query(`
                        INSERT INTO likes 
                            (like_user_id, like_content_id) 
                        VALUES (?,?)`,
                        [userId, content],
                        (error, result) => {
                            if (error) throw error;
                            else {
                                return res.status(200).json({ message: "Like Ajouté" });
                            }
                        }
                    );
                }
                break;
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
