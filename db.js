/**
 * miExpenses App
 *
 * Copyright (c) 2015 Alejandro Perez Martin (AlePerez92)
 *
 * @name          miExpenses
 * @description   JavaScript app using IndexedDB to track everyday expenses
 * @license       GNU General Public License (GPL), https://www.gnu.org/licenses/gpl.html
 * @version       1.0.0
 * @build         January 24, 2015
 * @repository    http://github.com/alejandroperezmartin/
 *
 * @author        Alejandro Perez Martin
 * @authorUrl     https://www.linkedin.com/in/aleperez92
 */

var miExpenses = (function () {

    'use strict';

    var idb = {},
        dataStore = null;

    idb.open = function (callback) {

        // Open connection to datastore
        var request = window.indexedDB.open('miExpenses', 1);

        request.onupgradeneeded = function (evt) {

            var db = evt.target.result;

            evt.target.transaction.onerror = idb.onerror;

            // Delete old datastore
            if (db.objectStoreNames.contains('expenses')) {
                db.deleteObjectStore('expenses');
            }

            // Create new objectstore
            var store = db.createObjectStore('expenses', {
                keyPath: 'timeStamp'
            });
        };

        request.onsuccess = function (evt) {
            dataStore = evt.target.result;
            callback();
        };

        request.onerror = idb.onerror;

    };

    idb.addExpense = function (expense, callback) {

        var db = dataStore,
            transaction = db.transaction(['expenses'], 'readwrite'),
            store = transaction.objectStore('expenses');

        var expense = {
            'name': expense.name,
            'date': expense.date,
            'amount': expense.amount,
            'category': expense.category,
            'timeStamp': Date.now()
        };

        var request = store.put(expense);

        request.onsuccess = function (evt) {
            callback(expense);
        };

        request.onerror = idb.onerror;

        transaction.onabort = idb.onerror;
    };

    idb.removeExpense = function (id, callback) {

        var db = dataStore,
            transaction = db.transaction(['expenses'], 'readwrite'),
            store = transaction.objectStore('expenses');

        var request = store.delete(parseInt(id));

        request.onsuccess = function (evt) {
            callback();
        };

        request.onerror = idb.onerror;
    };

    idb.fetchExpenses = function (callback) {

        var db = dataStore,
            transaction = db.transaction(['expenses'], 'readwrite'),
            store = transaction.objectStore('expenses');

        var keyRangeValue = IDBKeyRange.lowerBound(0),
            cursorRequest = store.openCursor(keyRangeValue);

        var expensesList = Array();

        transaction.oncomplete = function (evt) {
            callback(expensesList);
        };

        cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result;

            if (cursor) {
                expensesList.push(cursor.value);
                cursor.
                continue ();
            }
        };

        cursorRequest.onerror = idb.onerror;

        transaction.onabort = idb.onerror;
    };

    idb.emptyDatabase = function (evt) {

    };

    idb.deleteDatabase = function (evt) {

    }

    idb.onerror = function (evt) {
        console.log('Database error: ' + evt);
    };

    return idb;

}());
