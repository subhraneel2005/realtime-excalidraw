-- CreateIndex
CREATE INDEX "Chat_userId_idx" ON "Chat"("userId");

-- CreateIndex
CREATE INDEX "Chat_roomId_idx" ON "Chat"("roomId");

-- CreateIndex
CREATE INDEX "Room_adminId_idx" ON "Room"("adminId");
