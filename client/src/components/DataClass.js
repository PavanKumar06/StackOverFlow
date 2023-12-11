import axios from 'axios';

class DataClass {
    constructor(data) {
        this.answers = data.answers;
        this.questions = data.questions; 
        this.tags = data.tags;
        this.comments = data.comments;
    }

    async createNewAnswer(answer) {
        try {
            const updatedAnswer = await this.addAnswerOnServer(answer);
            return updatedAnswer;
        } catch (error) {
            console.error('Error updating views on the server: ', error);
        }
    }
    
    async createNewQuestion(question) {
        try {
            const updatedQuestion = await this.addQuestionOnServer(question);
            return updatedQuestion;
        } catch (error) {
            console.error('Error adding question on the server: ', error);
        }
    }

    async createNewTag(tag) {
        try {
            const updatedTag = await this.addTagOnServer(tag);
            return updatedTag;
        } catch (error) {
            console.error('Error adding tags on the server: ', error);
        }
    }

    async updateQuestion(qId, aId) {
        const questionIndex = this.questions.findIndex((question) => question.qid === qId);

        if (questionIndex !== -1) {
            try {
                await this.updateQuestionOnServer(qId, aId);
            } catch (error) {
                console.error('Error updating the answers for the question: ', error);
            }
        }
    }

    async updateViews(qId) {
        const questionIndex = this.questions.findIndex((question) => question.qid === qId);
        if (questionIndex !== -1) {
            const currViews = this.questions[questionIndex].views;

            try {
                await this.updateViewsOnServer(qId, currViews + 1);
            } catch (error) {
                console.error('Error updating views on the server: ', error);
            }
        }
    }

    async voteQuestion(qId, vote, user, currentUser) {
        const questionIndex = this.questions.findIndex((question) => question.qid === qId);
        const question = this.questions.find((question) => question.qid === qId);
        if (questionIndex !== -1) {
            const currVotes = this.questions[questionIndex].votes;
            let updatedVotes = currVotes;
            let updatedQuestion = question;

            try {
                if (vote === 'upvote') {
                    const hasDownvoted = question.downvoteBy.includes(user);
                    updatedVotes = hasDownvoted ? updatedVotes + 2 : updatedVotes + 1;
                    updatedQuestion = await this.upvotedBy(qId, user);
                }
                else {
                    const hasUpvoted = question.upvoteBy.includes(user);
                    updatedVotes = hasUpvoted ? updatedVotes - 2 : updatedVotes - 1;
                    updatedQuestion = await this.downvotedBy(qId, user);
                }
                await this.updateVotesOnServer(qId, updatedVotes);                
                const numberOfUpvotes = updatedQuestion.upvoteBy.length;
                const numberOfDownvotes = updatedQuestion.downvoteBy.length;
                const reputation = (numberOfUpvotes * 5) - (numberOfDownvotes * 10);
                await this.updateReputation(user, currentUser.reputation + reputation)
            } catch (error) {
                console.error('Error updating votes on the server: ', error);
            }
        }
    }

    async voteAnswer(aId, vote, user, currentUser) {
        const answerIndex = this.answers.findIndex((answer) => answer.aid === aId);
        const answer = this.answers.find((answer) => answer.aid === aId);
        if (answerIndex !== -1) {
            const currVotes = this.answers[answerIndex].votes;
            let updatedVotes = currVotes;
            let updatedAnswer = answer;
            
            try {
                if (vote === "upvote") {
                    const hasDownvoted = answer.downvoteBy.includes(user);
                    updatedVotes = hasDownvoted ? updatedVotes + 2 : updatedVotes + 1;
                    await this.upvotedAnswerBy(aId, user);
                } else {
                    const hasUpvoted = answer.upvoteBy.includes(user);
                    updatedVotes = hasUpvoted ? updatedVotes - 2 : updatedVotes - 1;
                    await this.downvotedAnswerBy(aId, user);
                }
                await this.updateAnswerVotesOnServer(aId, updatedVotes);
                const numberOfUpvotes = updatedAnswer.upvoteBy.length;
                const numberOfDownvotes = updatedAnswer.downvoteBy.length;
                const reputation = (numberOfUpvotes * 5) - (numberOfDownvotes * 10);
                await this.updateReputation(user, currentUser.reputation + reputation)
            } catch (error) {
                console.error('Error updating votes on the server: ', error);
            }
        }
    }

    async pinnedAnswer(qId, aId) {
        const questionIndex = this.questions.findIndex((question) => question.qid === qId);
        if (questionIndex !== -1) {
            try {
                await this.updatePinnedAnswer(qId, aId);
            } catch (error) {
                console.error('Error updating views on the server: ', error);
            }
        }
    }

    async updateQuestionTitleText(qId, title, text) {
        const questionIndex = this.questions.findIndex((question) => question.qid === qId);
        if (questionIndex !== -1) {
            try {
                await this.updateQuestionContent(qId, title, text);
            } catch (error) {
                console.error('Error updating question on the server: ', error);
            }
        }
    }

    async updateAnswerText(aId, text) {
        const answerIndex = this.answers.findIndex((answer) => answer.aid === aId);
        if (answerIndex !== -1) {
            try {
                await this.updateAnswerContent(aId, text)
            } catch(error) {
                console.error('Error updating answer on the server: ', error);
            }
        }
    }

    async updateTagName(tId, name) {
        const tagIndex = this.tags.findIndex((tag) => tag.tid === tId);
        if (tagIndex !== -1) {
            try {
                await this.updateTagContent(tId, name)
            } catch(error) {
                console.error('Error updating tag on the server: ', error);
            }
        }
    }

    async createNewComment(com) {
        try {
            const updatedComment = await this.addCommentOnServer(com);
            return updatedComment;
        } catch (error) {
            console.error('Error adding tags on the server: ', error);
        }
    }

    async updateQuestionComment(qId, cId) {
        const questionIndex = this.questions.findIndex((question) => question.qid === qId);
        if (questionIndex !== -1) {
            try {
                await this.updateQuestionCommentData(qId, cId);
            } catch (error) {
                console.error('Error updating question on the server: ', error);
            }
        }
    }

    async updateAnswerComment(aId, cId) {
        const answerIndex = this.answers.findIndex((answer) => answer.aid === aId);
        if (answerIndex !== -1) {
            try {
                await this.updateAnswerCommentData(aId, cId);
            } catch (error) {
                console.error('Error updating answers on the server: ', error);
            }
        }
    }

    async deleteAnswerText(aId) {
        const answerIndex = this.answers.findIndex((answer) => answer.aid === aId);
        if (answerIndex !== -1) {
            try {
                await this.deleteAnswerData(aId);
                const questionWithAnswer = this.questions.find((question) => question.ansIds.includes(aId));
                await this.deleteQuestionAnsId(questionWithAnswer.qid, aId)
            } catch (error) {
                console.error('Error deleting answers on the server: ', error);
            }
        }
    }

    async deleteQuestionAnsId(qid, aid) {
        try {
            await this.deleteQuestionAnsIdData(qid, aid);
        } catch(error) {
            console.error('Error deleting question answer on the server: ', error);
        }
    }

    async deleteQuestionText(qId) {
        const questionIndex = this.questions.findIndex((question) => question.qid === qId);
        if (questionIndex !== -1) {
            try {
                await this.deleteQuestionData(qId);
            } catch (error) {
                console.error('Error deleting questions on the server: ', error);
            }
        }
    }

    async deleteTagText(tId, userId) {
        const tagIndex = this.tags.findIndex((tag) => tag.tid === tId);
    
        if (tagIndex !== -1) {
            try {
                const allQuestions = this.getQuestions();
                const questionsWithTag = allQuestions.filter((question) => question.tagIds.includes(tId));
                const uniqueUserIds = new Set(questionsWithTag.map((question) => question.askedBy));
    
                if (uniqueUserIds.size > 1) {
                    throw new Error("Cannot delete tag. It is used by multiple users.");
                }
    
                const tagUser = uniqueUserIds.values().next().value;
                if (tagUser !== userId) {
                    throw new Error("Cannot delete tag. It is used by another user.");
                }
    
                await this.deleteTagData(tId);
            } catch (error) {
                throw new Error(error.message);
            }
        }
    }

    async updateLastAskDate(qId) {
        const questionIndex = this.answers.findIndex((question) => question.qid === qId);
        if (questionIndex !== -1) {
            try {
                await this.updateLastAskDateData(qId);
            } catch (error) {
                console.error('Error updating questions date on the server: ', error);
            }
        }
    }
    

    getAnswers() {
        return this.answers;
    }

    getQuestions() {
        return this.questions;
    }

    getTags() {
        return this.tags;
    }

    getComments() {
        return this.comments;
    }

    async addAnswerOnServer(answer) {
        const url = `http://localhost:8000/api/answers`; 

        try {
            const response = await axios.post(url, answer);
            const ans = response.data;
            return ans;
        } catch (error) {
            throw new Error(`Error adding answer on the server: ${error.message}`);
        }
    }

    async addQuestionOnServer(question) {
        const url = `http://localhost:8000/api/askQuestion`;

        try {
            const response = await axios.post(url, question);
            const ques = response.data;
            return ques;
        } catch (error) {
            throw new Error(`Error adding question on the server: ${error.message}`);
        }
    }

    async addTagOnServer(tag) {
        const url = `http://localhost:8000/api/tags`;

        try {
            const response = await axios.post(url, tag);
            const t = response.data;
            return t;
        } catch (error) {
            throw new Error(`Error adding tag on the server: ${error.message}`);
        }
    }

    async updateQuestionOnServer(qId, aId) {
        const url = `http://localhost:8000/api/questions/answer/${qId}`;
        const question = this.questions.find((question) => question.qid === qId);
        const ansId = question.ansIds;
        const updatedAnsId = [...ansId, aId];
        const data = { answers: updatedAnsId };

        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;
        } catch(error) {
            throw new Error (`Error updating question on the server: ${error.message}`);
        }
    }

    async updateViewsOnServer(qId, updatedViews) {
        const url = `http://localhost:8000/api/questions/${qId}`; 
        const data = { views: updatedViews };

        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;
        } catch (error) {
            throw new Error(`Error updating views on the server: ${error.message}`);
        }
    }

    async updateVotesOnServer(qId, updatedVotes) {
        const url = `http://localhost:8000/api/questions/votes/${qId}`;
        const data = { votes: updatedVotes };

        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;
        } catch (error) {
            throw new Error(`Error updating votes on the server: ${error.message}`)
        }
    }

    async upvotedBy(qId, upvotedBy) {
        const url = `http://localhost:8000/api/questions/upvotedby/${qId}`;
        const data = { upvotedBy: upvotedBy };
        
        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;
        } catch (error) {
            throw new Error(`Error updating user votes on the server: ${error.message}`)
        }
    }

    async downvotedBy(qId, downvotedBy) {
        const url = `http://localhost:8000/api/questions/downvotedby/${qId}`;
        const data = { downvotedBy: downvotedBy };
        
        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;
        } catch (error) {
            throw new Error(`Error updating user votes on the server: ${error.message}`)
        }
    }

    async updateAnswerVotesOnServer(aId, updatedVotes) {
        const url = `http://localhost:8000/api/answers/votes/${aId}`;
        const data = { votes: updatedVotes };

        try {
            const response = await axios.put(url, data);
            const updatedAnswer = response.data;
            return updatedAnswer;
        } catch (error) {
            throw new Error(`Error updating votes on the server: ${error.message}`)
        }
    }

    async upvotedAnswerBy(aId, upvotedBy) {
        const url = `http://localhost:8000/api/answers/upvotedby/${aId}`;
        const data = { upvoteBy: upvotedBy };
        
        try {
            const response = await axios.put(url, data);
            const updatedAnswer = response.data;
            return updatedAnswer;
        } catch (error) {
            throw new Error(`Error updating user votes on the server: ${error.message}`)
        }
    }

    async downvotedAnswerBy(aId, downvotedBy) {
        const url = `http://localhost:8000/api/answers/downvotedby/${aId}`;
        const data = { downvoteBy: downvotedBy };
        
        try {
            const response = await axios.put(url, data);
            const updatedAnswer = response.data;
            return updatedAnswer;
        } catch (error) {
            throw new Error(`Error updating user votes on the server: ${error.message}`)
        }
    }

    async updatePinnedAnswer(qId, aId) {
        const url = `http://localhost:8000/api/questions/pinnedanswer/${qId}`;
        const data = { aId: aId };

        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;
        } catch (error) {
            throw new Error(`Error updating pinned answer on the server: ${error.message}`)
        }
    }

    async updateQuestionContent(qId, title, text) {
        const url = `http://localhost:8000/api/questions/titletext/${qId}`;
        const data = { title: title, text: text };

        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;
        } catch(error) {
            throw new Error(`Error updating Question Content: ${error.message}`)
        }
    }

    async updateAnswerContent(aId, text) {
        const url = `http://localhost:8000/api/answers/text/${aId}`;
        const data = { text: text }

        try {
            const response = await axios.put(url, data);
            const updatedAnswer = response.data;
            return updatedAnswer;

        } catch(error) {
            throw new Error(`Error updating Answer Content: ${error.message}`)
        }
    }

    async updateTagContent(tId, name) {
        const url = `http://localhost:8000/api/tags/name/${tId}`;
        const data = { name: name }

        try {
            const response = await axios.put(url, data);
            const updatedTag = response.data;
            return updatedTag;

        } catch(error) {
            throw new Error(`Error updating Tag Content: ${error.message}`)
        }
    }

    async addCommentOnServer(com) {
        const url = `http://localhost:8000/api/comments`;

        try {
            const response = await axios.post(url, com);
            const c = response.data;
            return c;
        } catch (error) {
            throw new Error(`Error adding Comment on the server: ${error.message}`);
        }
    }

    async updateQuestionCommentData(qId, cId) {
        const url = `http://localhost:8000/api/questions/comments/${qId}`;
        const data = {cid: cId}
        
        try {
            const response = await axios.put(url, data);
            const updatedQuestion = response.data;
            return updatedQuestion;

        } catch(error) {
            throw new Error(`Error updating Question Comment Content: ${error.message}`)
        }
    }

    async updateAnswerCommentData(aId, cId) {
        const url = `http://localhost:8000/api/answers/comments/${aId}`;
        const data = {cid: cId}
        
        try {
            const response = await axios.put(url, data);
            const updatedAnswer = response.data;
            
            return updatedAnswer;
        } catch(error) {
            throw new Error(`Error updating Answer Comment Content: ${error.message}`)
        }
    }

    async deleteAnswerData(aId) {
        const url = `http://localhost:8000/api/answers/${aId}`;
        
        try {
            const response = await axios.delete(url);
            const deletedAnswer = response.data;
            
            return deletedAnswer;
        } catch(error) {
            throw new Error(`Error deleting Answer Content: ${error.message}`)
        }
    }

    async deleteQuestionAnsIdData(qid, aid) {
        const url = `http://localhost:8000/api/questions/answers/${qid}`;
        const data = {aid: aid}

        try {
            const response = await axios.put(url, data);
            const deletedQuestionAnswer = response.data;
            
            return deletedQuestionAnswer;
        } catch(error) {
            throw new Error(`Error deleting answer from question: ${error.message}`)
        }
    }

    async deleteQuestionData(qId) {
        const url = `http://localhost:8000/api/questions/${qId}`;
        
        try {
            const response = await axios.delete(url);
            const deletedQuestion = response.data;
            
            return deletedQuestion;
        } catch(error) {
            throw new Error(`Error deleting Question Content: ${error.message}`)
        }
    }
    
    async deleteTagData(tId) {
        const url = `http://localhost:8000/api/tags/${tId}`;
        
        try {
            const response = await axios.delete(url);
            const deletedTag = response.data;
            
            return deletedTag;
        } catch(error) {
            throw new Error(`Error deleting Tag Content: ${error.message}`)
        }
    }

    async updateLastAskDateData(qId) {
        const url = `http://localhost:8000/api/questions/lastAskDate/${qId}`;

        try {
            const response = await axios.put(url);
            const updatedQuestion = response.data;
            
            return updatedQuestion;
        } catch(error) {
            throw new Error(`Error updating Question Date Content: ${error.message}`)
        }
    }

    async updateReputation(username, reputation) {
        const url = `http://localhost:8000/api/users/reputation`;
        const data = {reputation: reputation, username: username};

        try {
            const response = await axios.put(url, data)
            const updatedUser = response.data;
            return updatedUser
        } catch(error) {
            throw new Error(`Error updating the reputation of the user`);
        }
    }
}

export default DataClass;
