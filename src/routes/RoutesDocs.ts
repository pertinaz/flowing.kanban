/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - title
 *         - column_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the card
 *         title:
 *           type: string
 *           description: The title of the card
 *         description:
 *           type: string
 *           description: The description of the card
 *         column_id:
 *           type: integer
 *           description: The id of the column the card belongs to
 *         user_id:
 *           type: integer
 *           description: The id of the user who owns the card
 *       example:
 *         id: 1
 *         title: "Implement login"
 *         description: "Create login functionality"
 *         column_id: 1
 *         user_id: 1
 */

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Returns a list of cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: The list of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: The card was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/cards/{id}:
 *   put:
 *     summary: Update a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The card id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: The card was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       400:
 *         description: Bad request
 *   delete:
 *     summary: Remove a card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The card id
 *     responses:
 *       204:
 *         description: The card was deleted
 *       400:
 *         description: Bad request
 */
